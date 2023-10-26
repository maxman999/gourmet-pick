package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;

    @PostMapping("/signUp")
    public int signUp(@RequestBody User user) {
        return userService.signUpOrUpdateUser(user);
    }

    @DeleteMapping("/{userId}")
    public int signOut(@PathVariable("userId") Long userId) {
        return userService.signOutById(userId);
    }

    @GetMapping("/{userId}")
    public User getUser(@PathVariable("userId") Long userId) {
        return userService.getUserById(userId);
    }

    @PostMapping("/updateNickname")
    public int updateNickname(@RequestBody User user) {
        return userService.updateNickname(user.getId(), user.getNickname());
    }


}
