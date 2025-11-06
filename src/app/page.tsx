"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import icon from "../assets/images/icon.png";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { legacyAuthSchema } from "@/validations/auth.validations";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

interface AuthFormData {
	user: string;
	passe: string;
}

export default function LoginPage() {

	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const { login, isAuthenticated, loading, isInitialized } = useAuth();
	const { userInfo } = usePermissions();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<AuthFormData>({
		resolver: yupResolver(legacyAuthSchema),
		defaultValues: {
			user: '',
			passe: ''
		}
	});

	useEffect(() => {
		if (isInitialized && isAuthenticated && !loading && userInfo) {
			// Redirecionar baseado no tipo de usuário
			if (userInfo.isProfessor) {
				router.push('/admin/perfil-professor');
			} else if (userInfo.isAluno) {
				router.push('/admin/perfil');
			} else {
				// Administradores e outros vão para dashboard
				router.push('/admin');
			}
		}
	}, [isAuthenticated, loading, isInitialized, userInfo, router]);

	const onSubmit = async (data: AuthFormData) => {
		if (isSubmitting || loading) return;
		await login(data.user, data.passe);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">

			<div className="relative w-full max-w-md">

				{/* Login form */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
					<div className="relative z-10">
						{/* Logo and welcome section */}
						<div className="text-center mb-8">
							<div className="mb-6 bg-gradient-to-br from-[#D2B48C]/20 via-[#F5DEB3]/15 to-[#D2B48C]/10 rounded-2xl p-4 w-24 h-24 mx-auto border-2 border-[#D2B48C]/30 items-center flex justify-center shadow-lg ring-1 ring-[#D2B48C]/20">
								<Image
									src={icon}
									alt="Complexo Abilio Junqueira Logo"
									width={60}
									height={55}
									className="mx-auto"
								/>
							</div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
								Acessa a tua conta
							</h1>
							<p className="text-gray-600 text-base">
								Use suas credenciais do sistema para acessar a plataforma.
							</p>

						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Username input */}
							<div className="space-y-2 ultra-fast-fade">
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<Controller
										name="user"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												id="user"
												type="text"
												placeholder="Digite seu username"
												className={`pl-10 h-12 border-gray-200 focus:border-[#8B4513] focus:ring-[#8B4513]/20 ${errors.user ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
													}`}
											/>
										)}
									/>
								</div>
								{errors.user && (
									<p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
								)}
							</div>

							{/* Password input */}
							<div className="space-y-2 ultra-fast-fade">
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<Controller
										name="passe"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												id="passe"
												type={showPassword ? "text" : "password"}
												placeholder="Digite tua senha"
												className={`pl-10 pr-10 h-12 border-gray-200 focus:border-[#8B4513] focus:ring-[#8B4513]/20 ${errors.passe ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
													}`}
											/>
										)}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
									>
										{showPassword ? (
											<Eye className="h-5 w-5" />
										) : (
											<EyeOff className="h-5 w-5" />
										)}
									</button>
								</div>
								{errors.passe && (
									<p className="text-red-500 text-sm mt-1">{errors.passe.message}</p>
								)}
							</div>

							{/* Remember me and forgot password */}
							<div className="flex items-center justify-between">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513] focus:ring-2"
									/>
									<span className="text-sm text-gray-600">Remember me</span>
								</label>
								<button
									type="button"
									className="text-sm text-[#8B4513] hover:text-[#A0522D] font-medium transition-colors"
								>
									Esqueci minha senha?
								</button>
							</div>

							{/* Login button */}
							<Button
								type="submit"
								disabled={isSubmitting || loading}
								className="w-full h-12 mb-8 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#8B4513] text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white loading-spinner"></div>
										<span>Entrando...</span>
									</div>
								) : 'Entrar'}
							</Button>

						</form>
					</div>
				</div>

				{/* Help section */}
				<div className="text-center mt-6">
					<p className="text-gray-600 text-sm">
						Problemas para acessar?{" "}
						<Button
							variant="link"
							className="text-[#8B4513] hover:text-[#A0522D] font-medium p-0 h-auto underline-offset-4 transition-colors cursor-pointer"
						>
							Entre em contato
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
}
