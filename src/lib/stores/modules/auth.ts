import { writable, type Writable } from 'svelte/store';
// import { browser } from '$app/environment'

export const isAuthorized: Writable<boolean> = writable(false);

// export const checkAuth = (api_key) => {
// 	if (browser) {
// 		if (window.self != window.top) {
// 			if (api_key) {
				
// 			}
// 		} else {
// 			console.log("Not in iframe")
// 		}
// 	}
// }
