package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.menu.dto.MenuThumbnail;
import com.kjy.gourmet.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
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
        return menuMapper.deleteTodayPick(roomId);
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
            String originalName = uploadFile.getOriginalFilename();
            String fileName = getFileName(originalName);
            String fileExtension = StringUtils.getFilenameExtension(fileName);

            String folderPath = makeFolder();
            String uuid = UUID.randomUUID().toString();
            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "." + fileExtension;
            try {
                File thumbnailFile = new File(saveName); // 원본을 썸네일 파일로 저장
                Thumbnailator.createThumbnail(uploadFile.getInputStream(), new FileOutputStream(thumbnailFile), 400, 400);
                resultDTOList.add(new MenuThumbnail(uuid, folderPath, fileExtension));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return new ResponseEntity<>(resultDTOList, HttpStatus.OK);
    }

    private String getFileName(String originalName) {
        int indexOfSlash = originalName.lastIndexOf("\\");
        return (indexOfSlash != -1) ? originalName.substring(indexOfSlash + 1) : originalName;
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
        ResponseEntity<byte[]> result = null;
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
