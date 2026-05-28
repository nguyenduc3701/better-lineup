package com.betterlineup.backend.service;

import com.betterlineup.backend.dto.request.ForgotPasswordRequest;
import com.betterlineup.backend.dto.request.LoginRequest;
import com.betterlineup.backend.dto.request.RegisterRequest;
import com.betterlineup.backend.dto.response.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest request);
    UserResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
}
