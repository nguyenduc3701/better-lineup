package com.betterlineup.backend.controller;

import com.betterlineup.backend.dto.request.ForgotPasswordRequest;
import com.betterlineup.backend.dto.request.LoginRequest;
import com.betterlineup.backend.dto.request.RegisterRequest;
import com.betterlineup.backend.dto.response.ApiResponse;
import com.betterlineup.backend.dto.response.UserResponse;
import com.betterlineup.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Đăng ký tài khoản thành công!")
                .data(response)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@RequestBody LoginRequest request) {
        UserResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Đăng nhập thành công!")
                .data(response)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Yêu cầu khôi phục mật khẩu thành công! Hãy kiểm tra log server.")
                .build());
    }
}
