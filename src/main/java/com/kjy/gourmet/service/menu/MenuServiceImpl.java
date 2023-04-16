package com.kjy.gourmet.service.menu;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MenuServiceImpl implements MenuService{

    private final MenuMapper menuMapper;

    @Override
    public int addMenu(Menu menu) {
        return menuMapper.insertMenu(menu);
    }

    @Override
    public int deleteMenuById(long menuId) {
        return menuMapper.deleteMenuById(menuId);
    }

    @Override
    public List<Menu> getMenuList(long roomId) {
        return menuMapper.selectMenuList(roomId);
    }
}
