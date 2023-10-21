package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.MenuThumbnail;
import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.service.menu.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/menu")
public class MenuApiController {

    private final MenuService menuService;

    @PostMapping("/insert")
    public int insertMenu(@RequestBody Menu menu) {
        return menuService.insertMenu(menu);
    }

    @PostMapping("/update")
    public int updateMenu(@RequestBody Menu menu) {
        return menuService.updateMenu(menu);
    }

    @GetMapping("/all/{roomId}")
    public List<Menu> getMenuList(@PathVariable("roomId") long roomId) {
        return menuService.getMenuList(roomId);
    }

    @GetMapping("/{menuId}")
    public Menu getMenu(@PathVariable("menuId") long menuId) {
        return menuService.getMenuById(menuId);
    }

    @DeleteMapping("/{menuId}")
    public int removeMenu(@PathVariable("menuId") long menuId) {
        return menuService.deleteMenu(menuId);
    }

    @PostMapping("/uploadMenuImageFile")
    public ResponseEntity<List<MenuThumbnail>> uploadFile(MultipartFile[] uploadFiles) {
        return menuService.uploadMenuImage(uploadFiles);
    }

    @PostMapping("/deleteMenuImageFile")
    public boolean deleteFile(@RequestBody Map<String, String> paramMap) {
        if (!paramMap.containsKey("imageFileName")) return false;
        return menuService.removeMenuImageFile(paramMap.get("imageFileName"));
    }

    @GetMapping("/getMenuImageURL")
    public ResponseEntity<byte[]> getFile(String fileName) {
        return menuService.getMenuImageURL(fileName);
    }

}
