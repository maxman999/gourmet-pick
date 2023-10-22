package com.kjy.gourmet.mapper;

import com.kjy.gourmet.domain.menu.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface MenuMapper {
    int insertMenu(Menu menu);

    int insertTodayPick(long roomId, long menuId);

    int deleteTodayPick(long roomId);

    int updateMenu(Menu menu);

    Menu selectMenu(long menuId);

    List<Menu> selectMenuList(long roomId);

    int deleteMenu(long menuId);

    List<String> getAllThumbnailsById(long roomId);

    int deleteAllMenu();
}
