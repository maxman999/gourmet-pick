package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RequestMapping("/api/user")
@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;

    @PostMapping("/signUp")
    public int signUp(@RequestBody User user) {
        return userService.signUp(user);
    }

    @DeleteMapping("/{userId}")
    public int signOut(@PathVariable("userId") Long userId) {
        return userService.signOut(userId);
    }

    @GetMapping("/{userId}")
    public User user(@PathVariable("userId") Long userId) {
        return userService.getUserById(userId);
    }

}
