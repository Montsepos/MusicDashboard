import time
import json
import os
import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import re
from webdriver_manager.chrome import ChromeDriverManager

# ✅ CONFIGURAR ENCODING UTF-8 PARA WINDOWS
if sys.platform == "win32":
    import locale
    try:
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except:
        try:
            locale.setlocale(locale.LC_ALL, 'C.UTF-8')
        except:
            pass

def safe_print(message):
    """Imprime de forma segura evitando errores de Unicode"""
    try:
        print(message)
    except UnicodeEncodeError:
        # Reemplazar caracteres problemáticos
        safe_message = message.encode('ascii', 'replace').decode('ascii')
        print(safe_message)
    except Exception:
        print("[LOG] (error de encoding en mensaje)")

def safe_str(value, max_length=100):
    """Convierte a string de forma segura"""
    try:
        if value is None:
            return "None"
        str_value = str(value)
        if len(str_value) > max_length:
            str_value = str_value[:max_length] + "..."
        # Reemplazar caracteres problemáticos
        return str_value.encode('ascii', 'replace').decode('ascii')
    except Exception:
        return "[VALUE_ERROR]"

class InstagramScraper:
    def __init__(self):
        safe_print("[INFO] Inicializando InstagramScraper con Selenium...")
        
        # Configurar opciones de Chrome
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        self.chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        self.chrome_options.add_experimental_option('useAutomationExtension', False)
        self.chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            safe_print("[INFO] Instalando/configurando ChromeDriver...")
            self.service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=self.service, options=self.chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            safe_print("[SUCCESS] ChromeDriver configurado correctamente")
        except Exception as e:
            safe_print(f"[ERROR] Error configurando ChromeDriver: {e}")
            raise e
        
        # Tiempo de espera predeterminado
        self.wait = WebDriverWait(self.driver, 20)
        
    def get_top_posts(self, username, limit=6, login_required=False):
        """Obtiene los posts más populares de un usuario de Instagram"""
        safe_print(f"[INFO] Scraping Instagram profile: @{username} (login: {login_required})")
        
        try:
            # Realizar login si es requerido
            if login_required:
                login_success = self._perform_login()
                if not login_success:
                    safe_print("[WARN] Login falló, continuando sin login...")
                else:
                    safe_print("[SUCCESS] Login exitoso")
                    time.sleep(3)
            
            # URL del perfil de Instagram
            profile_url = f"https://www.instagram.com/{username}/"
            safe_print(f"[DEBUG] Navegando a: {profile_url}")
            
            # Abrir la página del perfil
            self.driver.get(profile_url)
            time.sleep(8)  # Aumentar tiempo de espera inicial
            
            # Manejar cookies/dialogs si no hicimos login
            if not login_required:
                self._handle_initial_dialogs()
            
            # Verificar si el perfil existe y es público
            if self._is_private_or_not_found():
                safe_print(f"[WARN] Perfil @{username} no encontrado o es privado")
                return []
            
            # Esperar a que carguen las publicaciones con selectores actualizados
            safe_print("[DEBUG] Esperando a que carguen las publicaciones...")
            post_selectors = [
                "article a[href*='/p/']",
                "article a[href*='/reel/']",
                "a[href*='/p/']",
                "a[href*='/reel/']"
            ]
            
            posts_found = False
            for selector in post_selectors:
                try:
                    self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                    posts_found = True
                    safe_print(f"[SUCCESS] Publicaciones encontradas con selector: {selector}")
                    break
                except TimeoutException:
                    continue
            
            if not posts_found:
                safe_print("[WARN] No se pudieron encontrar publicaciones con ningún selector")
                return []
            
            # Scroll para cargar más posts
            self._scroll_to_load_posts()
            
            # Obtener enlaces a las publicaciones
            post_links = []
            for selector in post_selectors:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                post_links.extend(elements)
            
            safe_print(f"[INFO] Encontrados {len(post_links)} enlaces de posts")
            
            # Extraer URLs únicos
            post_urls = []
            seen_urls = set()
            
            for link in post_links:
                try:
                    href = link.get_attribute("href")
                    if href and ("/p/" in href or "/reel/" in href) and href not in seen_urls:
                        post_urls.append(href)
                        seen_urls.add(href)
                except:
                    continue
            
            safe_print(f"[INFO] URLs únicos de posts: {len(post_urls)}")
            
            if not post_urls:
                safe_print("[WARN] No se encontraron URLs de posts válidas")
                return []
            
            posts = []
            max_posts_to_check = min(15, len(post_urls))  # Aumentar número de posts a revisar
            
            # Extraer información de cada post
            for i, post_url in enumerate(post_urls[:max_posts_to_check]):
                try:
                    safe_print(f"[DEBUG] Procesando post {i+1}/{max_posts_to_check}: {post_url}")
                    
                    # Abrir la página del post
                    self.driver.get(post_url)
                    time.sleep(4)
                    
                    post_data = self._extract_post_data(post_url)
                    
                    if post_data and isinstance(post_data, dict):  # Verificar que es un dict válido
                        posts.append(post_data)
                        likes = post_data.get('like_count', 0)
                        post_type = post_data.get('type', 'UNKNOWN')
                        safe_print(f"[SUCCESS] Post {i+1} procesado: {likes} likes, tipo: {post_type}")
                    else:
                        safe_print(f"[WARN] Post {i+1} sin datos válidos")
                        
                except Exception as e:
                    safe_print(f"[ERROR] Error procesando post {i+1}: {safe_str(str(e))}")
                    continue
            
            # Ordenar posts por likes (descendente)
            posts.sort(key=lambda x: x.get('like_count', 0), reverse=True)
            
            # Limitar a la cantidad solicitada
            top_posts = posts[:limit]
            
            safe_print(f"[SUCCESS] {len(top_posts)} posts procesados exitosamente para @{username}")
            
            # ✅ DEBUG SEGURO: mostrar estructura sin caracteres problemáticos
            if top_posts:
                safe_print("[DEBUG] Estructura del primer post:")
                try:
                    for key, value in top_posts[0].items():
                        safe_key = safe_str(key, 20)
                        safe_value = safe_str(value, 50)
                        safe_print(f"  {safe_key}: {type(value).__name__} = {safe_value}")
                except Exception as e:
                    safe_print(f"[DEBUG] Error mostrando estructura: {safe_str(str(e))}")
            
            return top_posts
            
        except Exception as e:
            safe_print(f"[ERROR] Error general scraping Instagram: {safe_str(str(e))}")
            import traceback
            try:
                traceback.print_exc()
            except:
                safe_print("[ERROR] No se pudo mostrar traceback completo")
            return []
        finally:
            # Volver a Instagram home
            try:
                self.driver.get("https://www.instagram.com")
                time.sleep(2)
            except:
                pass
    
    def _scroll_to_load_posts(self):
        """Hace scroll para cargar más posts"""
        try:
            safe_print("[DEBUG] Haciendo scroll para cargar más posts...")
            for i in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
        except Exception as e:
            safe_print(f"[DEBUG] Error en scroll: {safe_str(str(e))}")
    
    def _handle_initial_dialogs(self):
        """Maneja dialogs iniciales como cookies"""
        try:
            safe_print("[DEBUG] Manejando dialogs iniciales...")
            
            # Selectores actualizados para dialogs de cookies
            cookie_selectors = [
                "//button[contains(text(), 'Allow essential and optional cookies')]",
                "//button[contains(text(), 'Accept')]",
                "//button[contains(text(), 'Accept All')]",
                "//button[contains(text(), 'Allow all cookies')]",
                "//button[contains(text(), 'Only allow essential cookies')]",
                "button[class*='_a9--']",  # Selector genérico para botones de Instagram
                "button[class*='_acan']"
            ]
            
            for selector in cookie_selectors:
                try:
                    if selector.startswith("//"):
                        element = self.driver.find_element(By.XPATH, selector)
                    else:
                        element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    
                    if element.is_displayed():
                        element.click()
                        safe_print(f"[DEBUG] Dialog cerrado con: {selector}")
                        time.sleep(2)
                        break
                except:
                    continue
                    
        except Exception as e:
            safe_print(f"[DEBUG] No se encontraron dialogs: {safe_str(str(e))}")
    
    def _is_private_or_not_found(self):
        """Verifica si el perfil es privado o no existe"""
        try:
            page_source = self.driver.page_source.lower()
            
            # Indicadores de problemas
            error_indicators = [
                "this account is private",
                "sorry, this page isn't available",
                "user not found",
                "página no disponible",
                "cuenta privada"
            ]
            
            for indicator in error_indicators:
                if indicator in page_source:
                    return True
            
            return False
            
        except:
            return True
    
    def _perform_login(self):
        """Realiza el login en Instagram"""
        try:
            safe_print("[INFO] Iniciando proceso de login...")
            
            # Credenciales
            username = "probandorolando123"
            password = "pr0banDO"
            
            # Ir a la página de login
            self.driver.get("https://www.instagram.com/accounts/login/")
            time.sleep(5)
            
            # Manejar cookies
            self._handle_initial_dialogs()
            
            # Esperar campos de login
            try:
                username_field = self.wait.until(
                    EC.presence_of_element_located((By.NAME, "username"))
                )
                password_field = self.driver.find_element(By.NAME, "password")
                safe_print("[DEBUG] Campos de login encontrados")
            except TimeoutException:
                safe_print("[ERROR] No se encontraron campos de login")
                return False
            
            # Escribir credenciales
            username_field.clear()
            username_field.send_keys(username)
            time.sleep(1)
            
            password_field.clear()
            password_field.send_keys(password)
            time.sleep(1)
            
            # Buscar botón de login
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Esperar confirmación
            time.sleep(8)
            
            # Verificar login exitoso
            if self._is_logged_in():
                safe_print("[SUCCESS] Login completado")
                self._handle_post_login_dialogs()
                return True
            else:
                safe_print("[ERROR] Login falló")
                return False
                
        except Exception as e:
            safe_print(f"[ERROR] Error durante login: {safe_str(str(e))}")
            return False
    
    def _is_logged_in(self):
        """Verifica si el login fue exitoso"""
        try:
            current_url = self.driver.current_url
            if "login" not in current_url:
                return True
                
            # Buscar elementos que indican login exitoso
            logged_indicators = [
                "[aria-label='Home']",
                "a[href='/direct/']",
                "svg[aria-label='Direct']"
            ]
            
            for indicator in logged_indicators:
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, indicator)
                    if element:
                        return True
                except:
                    continue
            
            return False
            
        except:
            return False
    
    def _handle_post_login_dialogs(self):
        """Maneja dialogs post-login"""
        try:
            safe_print("[DEBUG] Manejando dialogs post-login...")
            
            dialog_selectors = [
                "//button[contains(text(), 'Not Now')]",
                "//button[contains(text(), 'Not now')]",
                "//button[contains(text(), 'Skip')]",
                "//button[contains(text(), 'Maybe Later')]"
            ]
            
            for selector in dialog_selectors:
                try:
                    button = self.driver.find_element(By.XPATH, selector)
                    if button.is_displayed():
                        button.click()
                        safe_print("[DEBUG] Dialog post-login cerrado")
                        time.sleep(2)
                        break
                except:
                    continue
                    
        except Exception as e:
            safe_print(f"[DEBUG] Error manejando dialogs post-login: {safe_str(str(e))}")
    
    def _extract_post_data(self, post_url):
        """Extrae datos de un post individual - FORMATO COMPATIBLE CON FRONTEND"""
        try:
            # Extraer shortcode del URL
            shortcode_match = re.search(r'/(p|reel)/([^/]+)/', post_url)
            shortcode = shortcode_match.group(2) if shortcode_match else ""
            
            # Extraer likes
            like_count = self._extract_likes()
            
            # Extraer media URL
            media_url = self._extract_media_url()
            
            # Extraer caption de forma segura
            caption = self._extract_caption_safe()
            
            # Extraer timestamp
            timestamp = self._extract_timestamp()
            
            # Determinar tipo de post
            post_type = self._determine_post_type(post_url)
            
            # Extraer comentarios
            comment_count = self._extract_comment_count()
            
            # ✅ FORMATO COMPATIBLE CON EL FRONTEND - DATOS LIMPIOS
            post_data = {
                "id": shortcode,
                "shortcode": shortcode,
                "url": f"https://instagram.com/p/{shortcode}/",
                "permalink": post_url,
                "type": post_type,
                "media_type": post_type,
                "caption": caption,
                "text": caption,  # Alias para compatibilidad
                "like_count": like_count,
                "likes": like_count,  # Alias para compatibilidad
                "comment_count": comment_count,
                "comments": comment_count,  # Alias para compatibilidad
                "timestamp": timestamp,
                "taken_at": timestamp,  # Alias para compatibilidad
                "display_url": media_url,  # ✅ CAMPO REQUERIDO POR EL FRONTEND
                "media_url": media_url,
                "thumbnail_url": media_url,
                "image_url": media_url,
                "is_video": post_type in ["VIDEO", "REEL"],
                "video_url": media_url if post_type in ["VIDEO", "REEL"] else None,
                "width": 1080,  # Valor por defecto
                "height": 1080,  # Valor por defecto
                "owner": {
                    "username": post_url.split('/')[3] if len(post_url.split('/')) > 3 else "unknown"
                }
            }
            
            # ✅ LOG SEGURO
            safe_print(f"[DEBUG] Post extraído - ID: {shortcode}, Likes: {like_count}, Tipo: {post_type}")
            
            return post_data
            
        except Exception as e:
            safe_print(f"[ERROR] Error extrayendo datos del post: {safe_str(str(e))}")
            return None
    
    def _extract_caption_safe(self):
        """Extrae caption de forma segura sin errores de Unicode"""
        try:
            # Estrategias múltiples para caption
            strategies = [
                self._extract_caption_from_meta_safe,
                self._extract_caption_from_elements_safe
            ]
            
            for strategy in strategies:
                try:
                    caption = strategy()
                    if caption and len(caption) > 5:
                        # ✅ LIMPIAR CAPTION DE CARACTERES PROBLEMÁTICOS
                        clean_caption = caption.encode('ascii', 'replace').decode('ascii')
                        return clean_caption[:500]  # Limitar longitud
                except:
                    continue
            
            return ""
            
        except:
            return ""
    
    def _extract_caption_from_meta_safe(self):
        """Extrae caption de meta tags de forma segura"""
        try:
            meta_desc = self.driver.find_element(By.XPATH, "//meta[@name='description']").get_attribute("content")
            
            if meta_desc and ': "' in meta_desc:
                parts = meta_desc.split(': "', 1)
                if len(parts) > 1:
                    caption = parts[1].rstrip('". ')
                    # Limpiar caracteres problemáticos
                    return caption.encode('ascii', 'replace').decode('ascii')
            
            return ""
            
        except:
            return ""
    
    def _extract_caption_from_elements_safe(self):
        """Extrae caption de elementos DOM de forma segura"""
        try:
            selectors = [
                "article div[data-testid='post-comment-root'] span",
                "article span",
                "div[role='button'] span"
            ]
            
            for selector in selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        text = element.text.strip()
                        if text and len(text) > 10 and not text.isdigit():
                            # Limpiar caracteres problemáticos
                            return text.encode('ascii', 'replace').decode('ascii')
                except:
                    continue
            
            return ""
            
        except:
            return ""
    
    def _extract_likes(self):
        """Extrae número de likes"""
        try:
            # Múltiples estrategias para extraer likes
            strategies = [
                self._extract_likes_from_visible_elements,
                self._extract_likes_from_meta,
                self._extract_likes_from_json
            ]
            
            for strategy in strategies:
                try:
                    likes = strategy()
                    if likes > 0:
                        return likes
                except Exception:
                    continue
            
            return 0
            
        except Exception:
            return 0
    
    def _extract_likes_from_visible_elements(self):
        """Extrae likes de elementos visibles"""
        selectors = [
            "//span[contains(text(), 'likes')]",
            "//span[contains(text(), 'like')]",
            "//a[contains(@href, '/liked_by/')]//span",
            "section span",
            "article span"
        ]
        
        for selector in selectors:
            try:
                if selector.startswith("//"):
                    elements = self.driver.find_elements(By.XPATH, selector)
                else:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    text = element.text.strip()
                    if text and ('like' in text.lower() or text.replace(',', '').isdigit()):
                        numbers = re.findall(r'[\d,]+', text)
                        if numbers:
                            return self.parse_likes_count(numbers[0])
            except:
                continue
        
        return 0
    
    def _extract_likes_from_meta(self):
        """Extrae likes de meta description"""
        try:
            meta_desc = self.driver.find_element(By.XPATH, "//meta[@name='description']").get_attribute("content")
            
            if meta_desc:
                patterns = [
                    r'(\d+(?:,\d+)*) likes',
                    r'(\d+(?:,\d+)*) Me gusta',
                    r'(\d+[KMB]?) likes',
                    r'(\d+[KMB]?) Me gusta'
                ]
                
                for pattern in patterns:
                    match = re.search(pattern, meta_desc)
                    if match:
                        return self.parse_likes_count(match.group(1))
            
            return 0
            
        except:
            return 0
    
    def _extract_likes_from_json(self):
        """Extrae likes de JSON estructurado en la página"""
        try:
            # Buscar scripts con datos JSON
            scripts = self.driver.find_elements(By.TAG_NAME, "script")
            
            for script in scripts:
                content = script.get_attribute("innerHTML")
                if content and "like_count" in content:
                    # Buscar patrones de like_count en JSON
                    like_match = re.search(r'"like_count":(\d+)', content)
                    if like_match:
                        return int(like_match.group(1))
            
            return 0
            
        except:
            return 0
    
    def _extract_media_url(self):
        """Extrae URL de imagen o video"""
        try:
            selectors = [
                "article img[src*='cdninstagram']",
                "article img[src*='instagram']",
                "article img",
                "article video[src]",
                "img[src*='cdninstagram']",
                "video[src]"
            ]
            
            for selector in selectors:
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    media_url = element.get_attribute("src")
                    if media_url and len(media_url) > 10:
                        return media_url
                except:
                    continue
            
            return None
            
        except:
            return None
    
    def _extract_timestamp(self):
        """Extrae timestamp del post"""
        try:
            time_element = self.driver.find_element(By.TAG_NAME, "time")
            timestamp = time_element.get_attribute("datetime")
            if timestamp:
                # Convertir a timestamp Unix
                from datetime import datetime
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                return int(dt.timestamp())
            return int(time.time())  # Timestamp actual como fallback
        except:
            return int(time.time())
    
    def _determine_post_type(self, post_url):
        """Determina el tipo de post"""
        try:
            if "/reel/" in post_url:
                return "REEL"
            
            # Verificar si hay video
            video_elements = self.driver.find_elements(By.CSS_SELECTOR, "article video")
            if video_elements:
                return "VIDEO"
            
            # Verificar carrusel
            carousel_indicators = self.driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Next']")
            if carousel_indicators:
                return "CAROUSEL"
            
            return "IMAGE"
            
        except:
            return "IMAGE"
    
    def _extract_comment_count(self):
        """Extrae número de comentarios"""
        try:
            selectors = [
                "//span[contains(text(), 'comments')]",
                "//span[contains(text(), 'comment')]",
                "//a[contains(text(), 'View all')]"
            ]
            
            for selector in selectors:
                try:
                    element = self.driver.find_element(By.XPATH, selector)
                    text = element.text
                    numbers = re.findall(r'[\d,]+', text)
                    if numbers:
                        return self.parse_likes_count(numbers[0])
                except:
                    continue
            
            return 0
            
        except:
            return 0
    
    def parse_likes_count(self, likes_text):
        """Convierte texto de likes a número"""
        try:
            likes_text = str(likes_text).replace(",", "").replace(".", "")
            
            if "K" in likes_text:
                return int(float(likes_text.replace("K", "")) * 1000)
            elif "M" in likes_text:
                return int(float(likes_text.replace("M", "")) * 1000000)
            elif "B" in likes_text:
                return int(float(likes_text.replace("B", "")) * 1000000000)
            else:
                return int(likes_text)
        except:
            return 0
    
    def close(self):
        """Cierra el navegador"""
        try:
            safe_print("[INFO] Cerrando navegador...")
            self.driver.quit()
            safe_print("[SUCCESS] Navegador cerrado")
        except Exception as e:
            safe_print(f"[ERROR] Error cerrando navegador: {safe_str(str(e))}")