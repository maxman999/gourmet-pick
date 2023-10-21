package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.dto.MenuThumbnail;
import com.kjy.gourmet.domain.menu.Menu;
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
import java.util.List;
import java.util.UUID;

//Todo 사진 이미지 업로드 관련 스크립트 공격 예방하는 로직 추가할것
// 사진이름은 필요 없으니 파일명에서 제거 하고 uuid만 저장하는게 좋아보임

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
    public int addMenu(Menu menu) {
        return menuMapper.insertMenu(menu);
    }

    @Override
    public int deleteMenu(long menuId) {
        removeMenuImage(getMenuById(menuId).getThumbnail());
        return menuMapper.deleteMenu(menuId);
    }

    @Override
    public List<Menu> getMenuList(long roomId) {
        return menuMapper.selectMenuList(roomId);
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
    public boolean removeMenuImage(String fileName) {
        try {
            String srcFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
            File file = new File(uploadPath + File.separator + srcFileName);
            return file.delete();
        } catch (RuntimeException e) {
            log.error("썸네일 삭제 실패 ======> 파일명 {}", fileName);
            return false;
        }
    }

    @Override
    public void removeAllMenuImages(List<String> menuImageList) {
        menuImageList.forEach(this::removeMenuImage);
    }

}
