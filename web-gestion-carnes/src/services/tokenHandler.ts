"use client"
export function fetchToken() {
	return localStorage.getItem("token");
}