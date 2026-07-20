package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.menu.dto.MenuThumbnail;
import com.kjy.gourmet.mapper.MenuMapper;
import com.kjy.gourmet.service.voting.dto.Message;
import com.kjy.gourmet.service.voting.dto.VotingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class MenuServiceImpl implements MenuService {

    private final MenuMapper menuMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Value("${gourmet.upload.path}")
    private String uploadPath;

    @Override
    public Menu getMenuById(long menuId) {
        return menuMapper.selectMenu(menuId);
    }

    @Override
    public int insertMenu(Menu menu) {
        return menuMapper.insertMenu(menu);
    }

    @Override
    public int insertTodayPick(long roomId, long menuId) {
        return menuMapper.insertTodayPick(roomId, menuId);
    }

    @Override
    public int deleteTodayPick(long roomId) {
        int deleteResult = menuMapper.deleteTodayPick(roomId);
        if (deleteResult == 1) {
            Message todayPickDeleteMessage = new Message("server", 0, "people", VotingStatus.RESET, 0);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, todayPickDeleteMessage);
        }
        return deleteResult;
    }

    @Override
    public int updateMenu(Menu menu) {
        return menuMapper.updateMenu(menu);
    }

    @Override
    public int deleteMenu(long menuId) {
        removeMenuImageFile(getMenuById(menuId).getThumbnail());
        return menuMapper.deleteMenu(menuId);
    }

    @Override
    public List<Menu> getMenuList(long roomId) {
        return menuMapper.selectMenuList(roomId);
    }

    @Override
    public List<Menu> getTodayMenuList(long roomId) {
        // todo 각종 정보 수집하여, 랜덤추출이 아닌 선호도 반영된 리스트로 변경
        List<Menu> menuList = menuMapper.selectMenuList(roomId);
        Collections.shuffle(menuList);
        return menuList.subList(0, Math.min(menuList.size(), 6));
    }

    @Override
    public ResponseEntity<List<MenuThumbnail>> uploadMenuImage(MultipartFile[] files) {
        List<MenuThumbnail> resultDTOList = new ArrayList<>();
        for (MultipartFile uploadFile : files) {
            if (uploadFile == null || uploadFile.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "빈 이미지 파일은 업로드할 수 없습니다.");
            }

            String sourceExtension = getSupportedImageExtension(uploadFile);
            String fileExtension = "webp".equals(sourceExtension) ? "jpg" : sourceExtension;

            String folderPath = makeFolder();
            String uuid = UUID.randomUUID().toString();
            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "." + fileExtension;
            try {
                BufferedImage sourceImage = ImageIO.read(uploadFile.getInputStream());
                if (sourceImage == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 이미지 형식입니다. JPEG, PNG 또는 WebP 파일을 사용해주세요.");
                }

                BufferedImage thumbnailSource = "webp".equals(sourceExtension)
                        ? convertToRgb(sourceImage)
                        : sourceImage;

                File thumbnailFile = new File(saveName);
                Thumbnails.of(thumbnailSource)
                        .size(720, 720)
                        .outputFormat(fileExtension)
                        .toFile(thumbnailFile);
                resultDTOList.add(new MenuThumbnail(uuid, folderPath, fileExtension));
            } catch (IOException e) {
                log.error("메뉴 이미지 처리 실패: {}", uploadFile.getOriginalFilename(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지를 저장하지 못했습니다.", e);
            }
        }
        return new ResponseEntity<>(resultDTOList, HttpStatus.OK);
    }

    private String getSupportedImageExtension(MultipartFile uploadFile) {
        String contentType = uploadFile.getContentType();
        if ("image/jpeg".equalsIgnoreCase(contentType) || "image/jpg".equalsIgnoreCase(contentType)) {
            return "jpg";
        }
        if ("image/png".equalsIgnoreCase(contentType)) {
            return "png";
        }
        if ("image/webp".equalsIgnoreCase(contentType)) {
            return "webp";
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 이미지 형식입니다. JPEG, PNG 또는 WebP 파일을 사용해주세요.");
    }

    private BufferedImage convertToRgb(BufferedImage sourceImage) {
        BufferedImage rgbImage = new BufferedImage(
                sourceImage.getWidth(),
                sourceImage.getHeight(),
                BufferedImage.TYPE_INT_RGB
        );
        Graphics2D graphics = rgbImage.createGraphics();
        try {
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, rgbImage.getWidth(), rgbImage.getHeight());
            graphics.drawImage(sourceImage, 0, 0, null);
        } finally {
            graphics.dispose();
        }
        return rgbImage;
    }

    private String makeFolder() {
        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String folderPath = str.replace("/", File.separator);
        // make folder
        File uploadPathFolder = new File(uploadPath, folderPath);
        if (!uploadPathFolder.exists()) uploadPathFolder.mkdirs();
        return folderPath;
    }

    @Override
    public ResponseEntity<byte[]> getMenuImageURL(String fileName) {
        ResponseEntity<byte[]> result;
        try {
            String srcFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
            File file = new File(uploadPath + File.separator + srcFileName);
            HttpHeaders header = new HttpHeaders();
            // MIME타입 처리
            header.add("Content-Type", Files.probeContentType(file.toPath()));
            // 파일 데이터 처리
            result = new ResponseEntity<>(FileCopyUtils.copyToByteArray(file), header, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }

    @Override
    public List<String> getAllThumbnailsById(long roomId) {
        return menuMapper.getAllThumbnailsById(roomId);
    }

    @Override
    public boolean removeMenuImageFile(String fileName) {
        try {
            String srcFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
            File file = new File(uploadPath + File.separator + srcFileName);
            return file.delete();
        } catch (Exception e) {
            log.error("썸네일 삭제 실패 ======> 파일명 {}", fileName);
            return false;
        }
    }

    @Override
    public void removeAllMenuImages(List<String> menuImageList) {
        menuImageList.forEach(this::removeMenuImageFile);
    }

}
