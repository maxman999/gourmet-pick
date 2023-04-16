package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.service.menu.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/menu")
@RequiredArgsConstructor
@RestController
public class MenuApiController {

    private final MenuService menuService;

    @PostMapping("/add")
    public int addMenu(@RequestBody Menu menu){
        return menuService.addMenu(menu);
    }

    @GetMapping("/{roomId}")
    public List<Menu> getMenuList(@PathVariable("roomId") long roomId){
        return menuService.getMenuList(roomId);
    }

    @DeleteMapping("/{menuId}")
    public int removeMenu(@PathVariable("menuId") long menuId){
        return menuService.deleteMenuById(menuId);
    }

}
