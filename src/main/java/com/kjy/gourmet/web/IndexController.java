package com.kjy.gourmet.web;

import com.kjy.gourmet.config.auth.LoginUser;
import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

@Slf4j
@RequiredArgsConstructor
@Controller
public class IndexController {

    private final UserService userService;
    private final HttpSession httpSession;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @ResponseBody
    @GetMapping("/getAuthenticatedUserId")
    public long getAuthenticatedUserId(@LoginUser SessionUser user) {
        if (user == null) return 0;
        return userService.getUserByEmail(user.getEmail()).getId();
    }

    @PostMapping("/guest")
    public String guest(@AuthenticationPrincipal UserDetails userDetails) {
        User user = User.builder()
                .email(userDetails.getUsername())
                .nickname("GUEST")
                .role(Role.GUEST)
                .build();
        userService.signUpOrUpdateUser(user);
        httpSession.setAttribute("user", new SessionUser(user));
        return "redirect:/";
    }
}
