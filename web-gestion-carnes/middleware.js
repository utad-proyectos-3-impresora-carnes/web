const { NextResponse } = require('next/server');
const { auth } = require('./src/services/auth'); // Importa la función auth

const PUBLIC_URLS = ['/', '/register'];

function isPublicUrl(targetUrl) {
	return PUBLIC_URLS.includes(targetUrl);
}

async function middleware(request) {

	try {

		const pathname = request.nextUrl.pathname;

		if (!isPublicUrl(pathname)) {
			await auth();
		}

		return NextResponse.next();

	} catch (error) {

		return NextResponse.redirect(new URL('/', request.nextUrl.origin));

	}
}

const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.\\.(?:css|js|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot|json)).)',
	],
};

module.exports = { middleware, config };
