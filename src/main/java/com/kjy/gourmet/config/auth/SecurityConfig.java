package com.kjy.gourmet.config.auth;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOauth2UserService customOauth2UserService;

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, AuthenticationManagerBuilder auth) throws Exception {
        http
                .csrf().disable().headers().frameOptions().disable()
                .and()
                .authorizeRequests()
                .antMatchers("/", "/getAuthenticatedUserId", "/css/**", "/images/**", "/js/**").permitAll()
                .antMatchers("/api/**", "/ws/**").hasAnyRole(Role.USER.name(), Role.GUEST.name())
                .anyRequest().authenticated()
                .and()
                .formLogin().successForwardUrl("/guest").permitAll()
                .and()
                .logout().logoutSuccessUrl("/")
                .and()
                .oauth2Login()
                .loginPage("/")
                .userInfoEndpoint()
                .userService(customOauth2UserService);

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        List<UserDetails> guests = new ArrayList<>();
        for (int i = 1; i <= 100; i++) {
            UserDetails guest = User.builder().username("GUEST#" + i)
                    .password(passwordEncoder().encode("GUEST#" + i))
                    .roles(Role.GUEST.name())
                    .build();
            guests.add(guest);
        }
        return new InMemoryUserDetailsManager(guests);
    }


}
