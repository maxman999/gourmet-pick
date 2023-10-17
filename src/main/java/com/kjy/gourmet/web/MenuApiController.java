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

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/menu")
public class MenuApiController {

    private final MenuService menuService;

    @PostMapping("/add")
    public int addMenu(@RequestBody Menu menu) {
        return menuService.addMenu(menu);
    }

    @GetMapping("/{roomId}")
    public List<Menu> getMenuList(@PathVariable("roomId") long roomId) {
        return menuService.getMenuList(roomId);
    }

    @DeleteMapping("/{menuId}")
    public int removeMenu(@PathVariable("menuId") long menuId) {
        return menuService.deleteMenu(menuId);
    }

    @PostMapping("/uploadMenuImage")
    public ResponseEntity<List<MenuThumbnail>> uploadFile(MultipartFile[] uploadFiles) {
        return menuService.uploadMenuImage(uploadFiles);
    }

    @GetMapping("/getMenuImageURL")
    public ResponseEntity<byte[]> getFile(String fileName) {
        return menuService.getMenuImageURL(fileName);
    }


}
