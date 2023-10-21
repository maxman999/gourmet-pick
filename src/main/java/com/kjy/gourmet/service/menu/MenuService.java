package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.dto.MenuThumbnail;
import com.kjy.gourmet.domain.menu.Menu;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuService {
    int addMenu(Menu menu);

    Menu getMenuById(long menuId);

    int deleteMenu(long menuId);

    List<Menu> getMenuList(long roomId);

    ResponseEntity<List<MenuThumbnail>> uploadMenuImage(MultipartFile[] files);

    ResponseEntity<byte[]> getMenuImageURL(String fileName);

    List<String> getAllThumbnailsById(long roomId);

    void removeAllMenuImages(List<String> menuImageList);

    boolean removeMenuImage(String fileName);

}
