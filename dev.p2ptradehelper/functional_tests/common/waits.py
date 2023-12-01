from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait


# Ожидания
def wait_present(driver_init, selector_cat, selector, message):

    # Метод ожидания наличия элемента на странице

    if selector_cat == 'ID':
        return WebDriverWait(driver_init, 30).until(expected_conditions.presence_of_element_located((
            By.ID, selector)), message)
    if selector_cat == 'CSS':
        return WebDriverWait(driver_init, 30).until(expected_conditions.presence_of_element_located((
            By.CSS_SELECTOR, selector)), message)
    if selector_cat == 'XPATH':
        return WebDriverWait(driver_init, 30).until(expected_conditions.presence_of_element_located((
            By.XPATH, selector)), message)
    if selector_cat == 'LINK':
        return WebDriverWait(driver_init, 30).until(expected_conditions.presence_of_element_located((
            By.LINK_TEXT, selector)), message)


def wait_not_present(driver_init, selector_cat, selector, message):

    # Метод ожидания отсутствия элемента на странице

    if selector_cat == 'ID':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.ID, selector)), message)
    if selector_cat == 'CSS':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.CSS_SELECTOR, selector)), message)
    if selector_cat == 'XPATH':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.XPATH, selector)), message)
    if selector_cat == 'LINK':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.LINK_TEXT, selector)), message)


def wait_click(driver_init, selector_cat, selector, message):

    # Метод ожидания кликабельности элемента на странице

    if selector_cat == 'ID':
        return WebDriverWait(driver_init, 30).until(expected_conditions.element_to_be_clickable((
            By.ID, selector)), message)
    if selector_cat == 'CSS':
        return WebDriverWait(driver_init, 30).until(expected_conditions.element_to_be_clickable((
            By.CSS_SELECTOR, selector)), message)
    if selector_cat == 'XPATH':
        return WebDriverWait(driver_init, 30).until(expected_conditions.element_to_be_clickable((
            By.XPATH, selector)), message)
    if selector_cat == 'LINK':
        return WebDriverWait(driver_init, 30).until(expected_conditions.element_to_be_clickable((
            By.LINK_TEXT, selector)), message)


def wait_visible(driver_init, selector_cat, selector, message):

    # Метод ожидания видимости элемента на странице

    if selector_cat == 'ID':
        return WebDriverWait(driver_init, 30).until(expected_conditions.visibility_of_element_located((
            By.ID, selector)), message)
    if selector_cat == 'CSS':
        return WebDriverWait(driver_init, 30).until(expected_conditions.visibility_of_element_located((
            By.CSS_SELECTOR, selector)), message)
    if selector_cat == 'XPATH':
        return WebDriverWait(driver_init, 30).until(expected_conditions.visibility_of_element_located((
            By.XPATH, selector)), message)
    if selector_cat == 'LINK':
        return WebDriverWait(driver_init, 30).until(expected_conditions.visibility_of_element_located((
            By.LINK_TEXT, selector)), message)


def wait_not_visible(driver_init, selector_cat, selector, message):

    # Метод ожидания невидимости элемента на странице

    if selector_cat == 'ID':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.ID, selector)), message)
    if selector_cat == 'CSS':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.CSS_SELECTOR, selector)), message)
    if selector_cat == 'XPATH':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.XPATH, selector)), message)
    if selector_cat == 'LINK':
        return WebDriverWait(driver_init, 30).until(expected_conditions.invisibility_of_element_located((
            By.LINK_TEXT, selector)), message)
