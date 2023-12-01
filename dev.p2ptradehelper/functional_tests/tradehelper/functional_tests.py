import os

from selenium.webdriver.common.by import By

import p2phelper.functional_tests.conftest as conftest
from p2phelper.functional_tests.common.authorization import login, logout
from p2phelper.functional_tests.common.waits import wait_present, wait_click


def navbar_check(driver_init):
    wait_present(driver_init, 'ID', "app_icon", "Отсутствует иконка сайта в шапке")
    wait_present(driver_init, 'ID', "header_text", "Отсутствует название сайта в шапке")

    wait_click(driver_init, 'LINK', "Арбитраж", "Отсутствует ссылка для перехода в арбитраж")
    wait_click(driver_init, 'LINK', "Портфель", "Отсутствует ссылка для перехода в портфель")
    wait_click(driver_init, 'ID', "profile_link", "Отсутствует ссылка для перехода в профиль")


def test_profile(driver_init):
    login(conftest.login, conftest.password, driver_init)
    navbar_check(driver_init)

    wait_present(driver_init, 'XPATH', "//img[contains(@src, 'good_image')]",
                 "Изображение профиля отсутствует или не отображается")

    wait_present(driver_init, 'XPATH', "//img[contains(@src, 'edit_white_48dp.svg')]",
                 "Изображение редактирования профиля отсутствует или не отображается")

    wait_present(driver_init, "XPATH", "//h1[text()='autotester']", "Никнейм пользователя отсутствует")
    wait_present(driver_init, "XPATH", "//p[text()='auto tester']", "Полное имя пользователя отсутствует")
    wait_present(driver_init, "XPATH", "//p[text()='tester@gmail.com']", "Почта пользователя отсутствует")

    wait_click(driver_init, 'ID', "button_logout", "Отсутствует кнопка для выхода из профиля")
    wait_click(driver_init, 'ID', "button_logout", "Отсутствует кнопка для выхода из профиля")

    # Тестируем выход из профиля
    logout(driver_init)


def test_edit_profile(driver_init):
    login(conftest.login, conftest.password, driver_init)
    navbar_check(driver_init)

    wait_click(driver_init, 'ID', "edit_button", "Отсутствует кнопка для редактирования профиля")
    driver_init.find_element(By.ID, "edit_button").click()

    wait_present(driver_init, 'ID', "upload_photo", "Отсутствует кнопка для загрузки фотографии профиля")
    wait_click(driver_init, 'ID', "input_username", "Отсутствует поле для ввода логина")
    wait_click(driver_init, 'ID', "input_email", "Отсутствует поле для ввода почты")
    wait_click(driver_init, 'ID', "save_button", "Отсутствует кнопка сохранения профиля")

    # Проверка на предупреждение о существующем логине
    driver_init.find_element(By.ID, "input_username").clear()
    driver_init.find_element(By.ID, "input_email").clear()
    driver_init.find_element(By.ID, "input_username").send_keys(conftest.admin_login)
    driver_init.find_element(By.ID, "input_email").send_keys(conftest.email)
    driver_init.find_element(By.ID, "save_button").click()
    wait_present(driver_init, 'XPATH', '//div[contains(string(), "Имя пользователя или электронная почта уже заняты")]',
                 "Отсутствует сообщение о неверном логине или почте")

    # Проверка на предупреждение о существующей почте
    # driver_init.find_element(By.ID, "input_username").clear()
    # driver_init.find_element(By.ID, "input_email").clear()
    # driver_init.find_element(By.ID, "input_username").send_keys(conftest.login)
    # driver_init.find_element(By.ID, "input_email").send_keys(conftest.admin_email)
    # driver_init.find_element(By.ID, "save_button").click()
    # wait_present(driver_init, 'XPATH', '//div[contains(string(), "Имя пользователя или электронная почта уже заняты")]',
    #              "Отсутствует сообщение о неверном логине или почте")

    # Проверка на предупреждение о том, что загружено не изображение
    driver_init.find_element(By.ID, "input_username").clear()
    driver_init.find_element(By.ID, "input_email").clear()
    driver_init.find_element(By.ID, "input_username").send_keys(conftest.login)
    driver_init.find_element(By.ID, "input_email").send_keys(conftest.email)
    driver_init.find_element(By.ID, "upload_photo") \
        .send_keys(os.path.join(conftest.BASE_DIR, 'functional_tests/res_for_tests/no_image.txt'))
    driver_init.find_element(By.ID, "save_button").click()
    wait_present(driver_init, 'XPATH', '//div[contains(string(), "Загружаемый файл должен быть изображением")]',
                 "Отсутствует сообщение о неверном формате загруженного файла")

    # Проверка на предупреждение о недопустимом размере изображения
    driver_init.find_element(By.ID, "input_username").clear()
    driver_init.find_element(By.ID, "input_email").clear()
    driver_init.find_element(By.ID, "input_username").send_keys(conftest.login)
    driver_init.find_element(By.ID, "input_email").send_keys(conftest.email)
    driver_init.find_element(By.ID, "upload_photo") \
        .send_keys(os.path.join(conftest.BASE_DIR, 'functional_tests/res_for_tests/bad_image.jpg'))
    driver_init.find_element(By.ID, "save_button").click()
    wait_present(driver_init, 'XPATH', '//div[contains(string(), "Допустимый размер изображения - до 1МБ")]',
                 "Отсутствует сообщение о допустимом размере изображения")

    driver_init.find_element(By.ID, "input_username").clear()
    driver_init.find_element(By.ID, "input_email").clear()
    driver_init.find_element(By.ID, "input_username").send_keys(conftest.login + "_test")
    driver_init.find_element(By.ID, "input_email").send_keys("test_" + conftest.email)
    driver_init.find_element(By.ID, "upload_photo") \
        .send_keys(os.path.join(conftest.BASE_DIR, 'functional_tests/res_for_tests/good_image.gif'))

    wait_click(driver_init, 'ID', "save_button", "Отсутствует кнопка сохранения профиля")
    driver_init.find_element(By.ID, "save_button").click()

    wait_present(driver_init, "XPATH", "//h1[text()='autotester_test']", "Новый никнейм пользователя не сохранился")
    wait_present(driver_init, "XPATH", "//p[text()='auto tester']", "Полное имя пользователя отсутствует")
    wait_present(driver_init, "XPATH", "//p[text()='test_tester@gmail.com']", "Новая почта пользователя не сохранилась")

    # Ниже меняем данные тестового пользователя на старые

    wait_click(driver_init, 'ID', "edit_button", "Отсутствует кнопка для редактирования профиля")
    driver_init.find_element(By.ID, "edit_button").click()

    driver_init.find_element(By.ID, "input_username").clear()
    driver_init.find_element(By.ID, "input_email").clear()
    driver_init.find_element(By.ID, "input_username").send_keys(conftest.login)
    driver_init.find_element(By.ID, "input_email").send_keys(conftest.email)

    wait_click(driver_init, 'ID', "save_button", "Отсутствует кнопка сохранения профиля")
    driver_init.find_element(By.ID, "save_button").click()

    logout(driver_init)
