import { useState } from "react";
import { Monitor, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
export function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setTimeout(() => {
            if (username && password) {
                onLogin("SuperAdmin");
            }
            else {
                setError("Username dan password harus diisi");
                setLoading(false);
            }
        }, 800);
    };
    const handleQuickLogin = (role, lab) => {
        setLoading(true);
        setTimeout(() => {
            onLogin(role, lab);
        }, 500);
    };
    return (<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2F438F] via-[#3d5299] to-[#5D7CEB] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2F438F] to-[#5D7CEB] p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Monitor className="w-12 h-12 text-white"/>
            </div>
            <h1 className="text-white text-2xl font-semibold mb-1">
              Lkomp Hardware Overview
            </h1>
            <p className="text-white/80 text-sm">
              Sistem Monitoring & Manajemen Laboratorium
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <Input type="text" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10 h-11"/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <Input type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? (<EyeOff className="w-5 h-5"/>) : (<Eye className="w-5 h-5"/>)}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked)}/>
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Ingat saya
                </label>
              </div>

              {/* Error Message */}
              {error && (<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>)}

              {/* Login Button */}
              <Button type="submit" className="w-full h-11 bg-[#5D7CEB] hover:bg-[#4a6bd8] text-white" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Atau login cepat sebagai
                </span>
              </div>
            </div>

            {/* Quick Login Buttons */}
            <div className="space-y-3">
              <Button type="button" variant="outline" className="w-full h-10 border-[#5D7CEB] text-[#5D7CEB] hover:bg-[#5D7CEB] hover:text-white" onClick={() => handleQuickLogin("SuperAdmin")} disabled={loading}>
                Login as SuperAdmin
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 border-[#5D7CEB] text-[#5D7CEB] hover:bg-[#5D7CEB] hover:text-white" onClick={() => handleQuickLogin("AdminLab", "E4")} disabled={loading}>
                Login as Admin Lab E4
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 border-[#5D7CEB] text-[#5D7CEB] hover:bg-[#5D7CEB] hover:text-white" onClick={() => handleQuickLogin("AdminLab", "L4")} disabled={loading}>
                Login as Admin Lab L4
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 border-[#5D7CEB] text-[#5D7CEB] hover:bg-[#5D7CEB] hover:text-white" onClick={() => handleQuickLogin("AdminLab", "L3")} disabled={loading}>
                Login as Admin Lab L3
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => handleQuickLogin("Sekretaris")} disabled={loading}>
                Login as Sekretaris
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              © 2026 Laboratorium Komputer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>);
}
