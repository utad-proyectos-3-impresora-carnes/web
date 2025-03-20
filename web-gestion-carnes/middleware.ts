import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/services/auth'; // Importa la función auth

const PUBLIC_URLS: Array<string> = ['/', '/register'];

function isPublicUrl(targetUrl: string): boolean {
    return PUBLIC_URLS.includes(targetUrl);
}

export async function middleware(request: NextRequest) {

    console.log("Middleware ejecutándose en:", request.nextUrl.pathname);
    
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('userToken')?.value;

    // Si la URL es pública, permite el acceso sin hacer chequeo de autenticación
    if (isPublicUrl(pathname)) {
        return NextResponse.next();
    }

    // Si no tiene token, redirige a una página pública
    if (!token) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }

    // Llama a la función auth y permite el acceso si el token es válido
    try {
        const isAuthenticated = await auth();
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }
        return NextResponse.next(); // Permite que el usuario se quede en la página actual si ya tiene un token válido
    } catch (error) {
        console.error('Error en autenticación:', error);
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.\\.(?:css|js|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot|json)).)',
    ],
};
