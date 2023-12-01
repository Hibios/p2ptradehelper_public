import pytest
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

# Данные авторизации
login = "autotester"
password = "ProTest24"
email = "tester@gmail.com"

admin_login = "ivanm"
admin_email = "ivan141459@gmail.com"
BASE_DIR = "/home/ivanm/Projects/p2ptradehelper/p2phelper"

url = "http://127.0.0.1:8000/"


@pytest.fixture
def driver_init():
    opts = webdriver.ChromeOptions()
    opts.add_argument('--window-size=1920,1080')
    opts.add_argument('--start-maximized')
    opts.add_argument('--disable-infobars')
    opts.add_argument('--disable-gpu')
    opts.add_argument('--disable-extensions')
    opts.add_argument('--no-sandbox')

    # Инициализация вебдрайвера
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opts)
    driver.maximize_window()
    # Открыть портал
    driver.get(url)
    yield driver
    driver.quit()
