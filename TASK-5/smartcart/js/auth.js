function validateAuthForm(form) {
  const email = form.querySelector("[name='email']")?.value.trim();
  const password = form.querySelector("[name='password']")?.value || "";
  const confirm = form.querySelector("[name='confirm_password']")?.value;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return false;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return false;
  }
  if (confirm !== undefined && confirm !== password) {
    showToast("Passwords do not match.", "error");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!validateAuthForm(form)) event.preventDefault();
    });
  });

  document.querySelector("[data-forgot]")?.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Password reset UI ready. Connect email service in production.");
  });
});
