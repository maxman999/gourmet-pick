package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.menu.dto.MenuThumbnail;
import com.kjy.gourmet.domain.menu.Menu;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuService {
    int insertMenu(Menu menu);

    int insertTodayPick(long roomId, long menuId);

    int deleteTodayPick(long roomId);

    Menu getMenuById(long menuId);

    int updateMenu(Menu menu);

    int deleteMenu(long menuId);

    List<Menu> getMenuList(long roomId);

    List<Menu> getTodayMenuList(long roomId);

    ResponseEntity<List<MenuThumbnail>> uploadMenuImage(MultipartFile[] files);

    ResponseEntity<byte[]> getMenuImageURL(String fileName);

    List<String> getAllThumbnailsById(long roomId);

    void removeAllMenuImages(List<String> menuImageList);

    boolean removeMenuImageFile(String fileName);
}
