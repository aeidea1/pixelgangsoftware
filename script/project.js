document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar a");
  const content = document.querySelector(".content");
  const searchInput = document.getElementById("search-item");
  let suggestionsContainer = document.querySelector(".suggestions-container");

  // Функция для экранирования HTML
  function escapeHTML(string) {
    return string.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&':
          return '&';
        case '<':
          return '<';
        case '>':
          return '>';
        case '"':
          return '"';
        case "'":
          return '~'; // Замена апострофа на тильду
        default:
          return m;
      }
    });
  }

  // Данные о проектах
  const projectsData = {
    1: [
      { title: "Проект Альфа", description: "Этот проект использует React, Node.js и MongoDB для создания полноценного интернет-магазина.", image: "assets/img/project_alpha.png", downloadLink: "downloads/alpha_source.zip", downloadText: "Скачать Исходный Код" },
      { title: "Проект Бета", description: "Project Beta - это мобильное приложение, разработанное на Flutter, которое ориентировано на управление задачами.", image: "assets/img/project_beta.png", downloadLink: "downloads/beta_docs.pdf", downloadText: "Скачать Документацию" },
      { title: "Проект Гамма", description: "Project Gamma использует Python и фреймворк Django для создания надежного REST API.", image: "assets/img/project_gamma.png", downloadLink: "downloads/gamma_assets.zip", downloadText: "Скачать Ассеты" },
      { title: "Проект Дельта", description: "Project Delta - это панель визуализации данных, разработанная с использованием D3.js.", image: "assets/img/project_delta.png", downloadLink: "downloads/delta_report.csv", downloadText: "Скачать Отчет" },
      { title: "Проект Эпсилон", description: "Project Epsilon - это модель машинного обучения, реализованная в TensorFlow для распознавания изображений.", image: "assets/img/project_epsilon.png", downloadLink: "downloads/epsilon_model.h5", downloadText: "Скачать ML Модель" }
    ],
    2: [
      { title: "Макет Сайта для Кофейни", description: "Дизайн макет сайта для кофейни, разработанный в Figma. Включает в себя главную страницу, страницу меню и страницу контактов.", image: "assets/img/design_coffe.png", downloadLink: "downloads/design_coffe.fig", downloadText: "Скачать Figma Файл" },
      { title: "Макет Мобильного Приложения для Заказа Еды", description: "Дизайн макет мобильного приложения для заказа еды, разработанный в Adobe XD. Включает в себя экраны выбора ресторана, просмотра меню и оформления заказа.", image: "assets/img/design_food.png", downloadLink: "downloads/design_food.xd", downloadText: "Скачать Adobe XD Файл" }
    ],
    3: [
      { title: "Алгоритм Сортировки Пузырьком на Python", description: "Пример реализации алгоритма сортировки пузырьком на языке Python.", codeSnippet: "def bubble_sort(list_):\n n = len(list_)\n for i in range(n-1):\n for j in range(n-i-1):\n if list_[j] > list_[j+1]:\n list_[j], list_[j+1] = list_[j+1], list_[j]\n return list_", downloadLink: "downloads/bubble_sort.py", downloadText: "Скачать Python Файл" },
      { title: "Реализация Паттерна Singleton на Java", description: "Пример реализации паттерна Singleton на языке Java.", codeSnippet: "public class Singleton {\n private static Singleton instance;\n private Singleton() {}\n public static Singleton getInstance() {\n if (instance == null) {\n instance = new Singleton();\n }\n return instance;\n }\n}", downloadLink: "downloads/Singleton.java", downloadText: "Скачать Java Файл" }
    ],
    4: [
      { title: "Приложение для учета финансов", description: "Приложение для ведения личных финансов на .NET", image: "assets/img/project_finance.png", downloadLink: "downloads/finance.zip", downloadText: "Скачать" },
    ],
    5: [
      { title: "Описание Архитектуры REST API", description: "Документ с описанием архитектуры REST API для веб-приложения.", codeSnippet: "# Описание REST API\n\n## Endpoints\n\n- GET /users: Получение списка всех пользователей\n- POST /users: Создание нового пользователя\n- GET /users/{id}: Получение информации о конкретном пользователе", downloadLink: "downloads/api_architecture.md", downloadText: "Скачать Markdown Файл" },
      { title: "Руководство по Использованию Библиотеки TensorFlow", description: "Руководство по использованию библиотеки TensorFlow для машинного обучения.", codeSnippet: "import tensorflow as tf\n\n# Создание модели\nmodel = tf.keras.models.Sequential([\n tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),\n tf.keras.layers.Dropout(0.2),\n tf.keras.layers.Dense(10, activation='softmax')\n])", downloadLink: "downloads/tensorflow_guide.pdf", downloadText: "Скачать Markdown Файл" }
    ]
  };

  const categoryTitles = {
    1: "Сайты",
    2: "Дизайн макеты",
    3: "Открытый код",
    4: ".NET Desktop",
    5: "Документы"
  };

  // Функция для создания HTML для проекта
  function createProjectHTML(project, categoryId) {
    let imageHTML = '';
    let codeSnippetHTML = '';

    if (categoryId !== '3' && categoryId !== '5' && project.image) {
      imageHTML = `<img src="${project.image}" alt="Скриншот проекта ${project.title}" width="300">`;
    }

    if (project.codeSnippet && (categoryId === '3' || categoryId === '5')) {
      codeSnippetHTML = `
            <div class="code-block">
                <pre><code class="code-green">${escapeHTML(project.codeSnippet)}</code></pre>
            </div>`;
    }

    return `
        <div class="news project" id="${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}">
            <h2>${project.title}</h2>
            ${imageHTML}
            <p>${project.description}</p>
            ${codeSnippetHTML}
            ${project.downloadLink ? `<a href="${project.downloadLink}" download="${project.downloadLink.split('/').pop()}"><button>${project.downloadText}</button></a>` : ''}
        </div>
    `;
  }

  // Функция для отображения проектов
  function displayProjects(categoryId) {
    content.innerHTML = ""; // Clear existing content

    // Add category title
    const categoryTitleEl = document.createElement("h1");
    categoryTitleEl.textContent = categoryTitles[categoryId] || getCategoryTitle(categoryId) || "Раздел"; // Use getCategoryTitle function if categoryTitles doesn't exist
    content.appendChild(categoryTitleEl);

    if (projectsData[categoryId] && projectsData[categoryId].length > 0) {
      projectsData[categoryId].forEach(project => {
        const projectHTML = createProjectHTML(project, categoryId);
        content.innerHTML += projectHTML;
      });
    } else {
      content.innerHTML += "<p>Проекты в данной категории отсутствуют.</p>";
    }

    //Scroll to top after displaying projects (with timeout)
    // setTimeout(() => {
    //     scrollToTop(content, 300);
    // }, 50); // slight delay - REMOVED
  }

  // Функция для получения заголовка категории (если нет в categoryTitles)
  function getCategoryTitle(categoryId) {
    const titles = {
      1: "Сайты",
      2: "Дизайн макеты",
      3: "Открытый код",
      4: ".NET Desktop",
      5: "Документы"
    };
    return titles[categoryId] || "Раздел";
  }

  // Функция плавной прокрутки вверх
  function scrollToTop(element, duration = 300) {
    console.log("scrollToTop called!"); // (1) Check if this function is called
    const start = element.scrollTop;
    console.log("element.scrollTop:", start); // (2) Log the scrollTop value
    const change = -start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, start, change, duration);
      // Use window.scrollTo instead of element.scrollTop
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Функция для прокрутки к элементу с задержкой
  function scrollToElement(categoryId, articleTitle) {
    const elementId = articleTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    // Delay the execution of the scrolling logic
    setTimeout(() => {
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Element with id "${elementId}" not found`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }

  // Обработчик кликов по ссылкам в сайдбаре
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const categoryId = this.dataset.article;
      displayProjects(categoryId); // Display projects for selected category
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Функция поиска проектов (замена старой)
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const suggestions = [];

    // Ищем соответствия в названиях проектов
    for (const categoryId in projectsData) {
      projectsData[categoryId].forEach(project => {
        if (project.title.toLowerCase().includes(searchTerm)) {
          suggestions.push({ title: project.title, categoryId: categoryId });
        }
      });
    }

    // Отображаем подсказки (можно улучшить визуально)
    displaySuggestions(suggestions);
  });

  function displaySuggestions(suggestions) {
    // Clone the suggestionsContainer
    const suggestionsContainerClone = suggestionsContainer.cloneNode(false);

    // Clear the original suggestionsContainer
    while (suggestionsContainer.firstChild) {
      suggestionsContainer.removeChild(suggestionsContainer.firstChild);
    }

    // Create and append new suggestion items to the cloned container
    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = suggestion.title;
      suggestionItem.style.cursor = "pointer";

      suggestionItem.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        scrollToArticle(suggestion.categoryId, suggestion.title);
        searchInput.value = "";
        clearSearch(); // Очистить подсказки после выбора
      });

      suggestionsContainerClone.appendChild(suggestionItem);
    });

    // Replace the original suggestionsContainer with the cloned one
    suggestionsContainer.parentNode.replaceChild(suggestionsContainerClone, suggestionsContainer);

    // Update the suggestionsContainer variable to point to the new container
    suggestionsContainer = suggestionsContainerClone;

    // Show the suggestions container if there are suggestions
    if (suggestions.length > 0) {
      suggestionsContainer.classList.add("show");
    } else {
      suggestionsContainer.classList.remove("show");
    }
  }

  // Функция для прокрутки к статье и отображения контента категории
  function scrollToArticle(categoryId, articleTitle) {
    displayProjects(categoryId); // Отображаем все проекты категории
    const elementId = articleTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Element with id "${elementId}" not found`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }
  function clearSearch() {
    searchInput.value = "";
    suggestionsContainer.classList.remove("show");

  }

  // Закрытие подсказок при клике вне поля поиска и подсказок
  document.addEventListener("click", function (event) {
    if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
      clearSearch();
    }
  });
  // Инициализация отображения проектов для первой категории (Сайты)
  displayProjects(1);
});