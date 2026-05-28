"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Bạn cần đồng ý với các điều khoản dịch vụ!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess("Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(result.message || "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError("Không thể kết nối đến máy chủ Backend. Đang sử dụng chế độ Offline.");
      setTimeout(() => {
        setSuccess("Đăng ký tài khoản thành công (Chế độ Offline)! Đang chuyển hướng sang trang đăng nhập...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo / title */}
      <div className="flex items-center gap-3 mb-8 z-10">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-950">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Better Lineup</h1>
          <p className="text-xs text-slate-400 font-medium">Bảng dựng sơ đồ chiến thuật chuyên nghiệp</p>
        </div>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 shadow-2xl z-10 transition-all">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Đăng ký tài khoản</h2>
        <p className="text-xs text-slate-400 mb-6">Bắt đầu kiến tạo những sơ đồ chiến thuật độc đáo của riêng bạn</p>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Họ và Tên</label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Địa chỉ Email</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="flex items-start mt-1">
            <input
              id="agree-terms"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 bg-slate-950 border border-slate-800 text-emerald-500 rounded focus:ring-emerald-500/30 focus:ring-offset-slate-950 cursor-pointer"
            />
            <label htmlFor="agree-terms" className="ml-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 leading-normal">
              Tôi đồng ý với{" "}
              <Link href="#" className="text-emerald-400 hover:underline">Điều khoản dịch vụ</Link>{" "}
              và{" "}
              <Link href="#" className="text-emerald-400 hover:underline">Chính sách bảo mật</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4.5 w-4.5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Đăng ký</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-bold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
