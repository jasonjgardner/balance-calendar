(() => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const metaLinks = [
    ...document.querySelectorAll('link[rel="manifest"]'),
    ...document.querySelectorAll('link[rel="icon"]')
  ];

  const getDefaultTheme = () =>
    localStorage.getItem("calendarTheme") === "dark" ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const toggleTheme = e => {
    const enableDarkMode = e.detail.colorScheme === "dark";

    for (const link of metaLinks) {
      link.href = enableDarkMode
        ? link.dataset.hrefDark
        : link.dataset.hrefLight;
    }

    metaThemeColor.content =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--color_theme"
      ) || enableDarkMode
        ? "black"
        : "white";
  };

  document.addEventListener("colorschemechange", toggleTheme);

  toggleTheme({ detail: { colorScheme: getDefaultTheme() } });
})();
