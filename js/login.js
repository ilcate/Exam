import RemoteDataManager from "./classes/RemoteDataManager.js";
import { qs } from "./utils.js";

const _app = {};

_app.checkPasswords = () => {
	return qs("#passwordField").value === qs("#passwordConfirmField").value;
};

_app.loginForm_submitHandler = event => {
	event.preventDefault();
	event.stopPropagation();

	const user = {
		email: qs("#emailLoginField").value,
		password: qs("#passwordLoginField").value,
	};

	const rdm = new RemoteDataManager();
	rdm.loginUser(user)
	.then(data => {
		console.log({data});

		if (data.payload.rc !== 1) {
			alert("cant log in");
		}
		else {
			document.location = "/index.html";
		}
	});

	return false;
};

_app.logoutBtn_clickHandler = () => {
	const rdm = new RemoteDataManager();
	rdm.logoutUser()
	.then(data => {
		document.location = "/login.html";
	});
};

_app.pictureField_changeHandler = event => {
	const rdm = new RemoteDataManager();

	rdm.uploadFiles(event.target)
	.then(data => {
		console.log("uploadFiles", data);
	});
};

_app.registrationForm_submitHandler = event => {
	event.preventDefault();
	event.stopPropagation();
	console.log("Invio form", event);

	qs("#passwordField").classList.remove("is-invalid");
	qs("#passwordField").classList.remove("is-valid");
	qs("#passwordConfirmField").classList.remove("is-invalid");
	qs("#passwordConfirmField").classList.remove("is-valid");

	if (!_app.checkPasswords()) {
		qs("#passwordField").classList.add("is-invalid");
		qs("#passwordConfirmField").classList.add("is-invalid");

		setTimeout(() => {
			alert("Attenzione, le due password non corrispondono");
		}, 100);

		return;
	}

	qs("#passwordField").classList.add("is-valid");
	qs("#passwordConfirmField").classList.add("is-valid");

	const user = {
		avatarURL: "",
		email: qs("#emailField").value,
		extraData: {
			qualsiasi: "",
			cosa: true,
			vogliate: 23432,
		},
		firstName: "",
		lastName: "",
		password: qs("#passwordField").value,
	};

	console.log({user});

	const rdm = new RemoteDataManager();
	rdm.registerUser(user)
	.then(data => {
		console.log(data);

		if (data.payload.rc === 1) {
			alert("registration success");
			document.location = "/login.html";
		}
		else if (data.payload.rc === 99) {
			alert(data.payload.errors[0].error);	
		}
	});

	return false;
};

_app.setupLoginForm = () => {
	_app.loginForm = qs("#loginForm");
	_app.loginForm.addEventListener("submit", _app.loginForm_submitHandler);
};

_app.setupRegisterForm = () => {
	_app.registrationForm = qs("#registrationForm");
	_app.registrationForm.addEventListener("submit", _app.registrationForm_submitHandler);
};

_app.startUp = () => {
	console.log("Ci siamo");

	_app.logoutBtn = qs("#logoutBtn");
	if (_app.logoutBtn) {
		_app.logoutBtn.addEventListener("click", _app.logoutBtn_clickHandler);
	}

	_app.pictureField = qs("#pictureField");
	if (_app.pictureField) {
		_app.pictureField.addEventListener("change", _app.pictureField_changeHandler);
	}

	if (document.location.pathname.includes("login.html")) {
		_app.setupLoginForm();
	}
	else if (document.location.pathname.includes("register.html")) {
		_app.setupRegisterForm();
	}

	const freePages = ["/register.html"];

	if (!freePages.includes(document.location.pathname)) {
		const rdm = new RemoteDataManager();
		rdm.getUserFromToken()
		.then(data => {
			console.log("getUserFromToken", data);

			if (data.status === "error" && !document.location.pathname.includes("login.html")) {
				document.location = "/login.html";
			}
		});
	}
};

_app.startUp();