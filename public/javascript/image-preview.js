window.addEventListener('DOMContentLoaded', (e) => {
	const currentImageElement = document.getElementById('cheeseImage');
	const imageUpload = document.getElementById('image');

	imageUpload.addEventListener('change', (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			currentImageElement.src = e.target.result;
		};
		reader.readAsDataURL(file);
	});
});
