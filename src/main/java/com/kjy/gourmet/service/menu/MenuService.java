package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.menu.Menu;

import java.util.List;

public interface MenuService {
    int addMenu(Menu menu);
    int deleteMenuById(long menuId);
    List<Menu> getMenuList(long roomId);
}
