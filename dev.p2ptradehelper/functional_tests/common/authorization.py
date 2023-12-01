from selenium.webdriver.common.by import By
from p2phelper.functional_tests.common.waits import wait_present, wait_click


# Вход
def login(login, password, driver_init):
    # Проверка наличия поля для ввода логина
    wait_present(driver_init, 'ID', "input_login", "Отсутствует поле для ввода логина")
    # Проверка наличия поля для ввода пароля
    wait_present(driver_init, 'ID', "input_password", "Отсутствует поле для ввода пароля")
    # Проверка наличия кнопки входа
    wait_present(driver_init, 'ID', "button_submit", "Отсутствует кнопка входа")
    # Ввести логин
    driver_init.find_element(By.ID, "input_login").send_keys(login)
    # Ввести пароль
    driver_init.find_element(By.ID, "input_password").send_keys(password)
    # Нажать "Войти"
    driver_init.find_element(By.ID, "button_submit").click()
    # Ждать загрузки меню
    wait_click(driver_init, 'LINK', "Арбитраж", "Отсутствует пункт меню Арбитраж")
    wait_click(driver_init, 'LINK', "Портфель", "Отсутствует пункт меню Портфель")


# Выход
def logout(driver_init):
    wait_click(driver_init, 'ID', "button_logout", "Отсутствует кнопка выхода из профиля")
    driver_init.find_element(By.ID, "button_logout").click()

    # Проверка что мы оказались на странице входа
    wait_present(driver_init, 'ID', "input_login", "Отсутствует поле для ввода логина")
    wait_present(driver_init, 'ID', "input_password", "Отсутствует поле для ввода пароля")
    wait_present(driver_init, 'ID', "button_submit", "Отсутствует кнопка входа")

