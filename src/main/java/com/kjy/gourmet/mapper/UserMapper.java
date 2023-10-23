package com.kjy.gourmet.mapper;

import com.kjy.gourmet.domain.user.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UserMapper {
    int insertUser(User user);

    int insertOrUpdateUser(User user);

    int updateNickname(long userId, String nickname);

    User selectUserByEmail(String email);

    User selectUserById(long userId);

    int deleteUserById(long userId);

    int deleteUserByEmail(String email);
}
