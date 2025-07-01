import sys
import json
import os

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
        # Reemplazar caracteres problemáticos para mostrar
        return str_value.encode('ascii', 'replace').decode('ascii')
    except Exception:
        return "[VALUE_ERROR]"

def clean_post_for_json(post):
    """Limpia un post para que sea serializable en JSON sin errores de Unicode"""
    try:
        if not isinstance(post, dict):
            return post
        
        cleaned_post = {}
        for key, value in post.items():
            try:
                # Limpiar strings que puedan tener caracteres problemáticos
                if isinstance(value, str):
                    # Mantener los caracteres Unicode para el JSON, solo limpiar para print
                    cleaned_post[key] = value
                elif isinstance(value, dict):
                    cleaned_post[key] = clean_post_for_json(value)
                else:
                    cleaned_post[key] = value
            except Exception as e:
                safe_print(f"[WARN] Error limpiando campo {key}: {e}")
                cleaned_post[key] = str(value) if value is not None else ""
        
        return cleaned_post
    except Exception as e:
        safe_print(f"[ERROR] Error limpiando post: {e}")
        return post

# Asegurarse de que el directorio scraper está en el path
current_dir = os.path.dirname(__file__)
scraper_dir = os.path.join(current_dir, 'scraper')
if scraper_dir not in sys.path:
    sys.path.insert(0, scraper_dir)

try:
    from scraper.instagram import InstagramScraper
except ImportError:
    # Si no encuentra el módulo, intentar importar directamente
    try:
        from instagram import InstagramScraper
    except ImportError:
        safe_print("[ERROR] No se puede importar InstagramScraper")
        safe_print("[DEBUG] Verificar que existe el archivo scraper/instagram.py")
        safe_print(f"[DEBUG] Directorio actual: {current_dir}")
        safe_print(f"[DEBUG] Buscando en: {scraper_dir}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        safe_print("[ERROR] Uso: python instagram_scraper.py <username> [limit] [login]")
        safe_print("[EXAMPLE] python instagram_scraper.py montsepos 6 false")
        sys.exit(1)
    
    username = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    use_login = sys.argv[3].lower() == 'true' if len(sys.argv) > 3 else False
    
    safe_print(f"[INFO] Iniciando scraper para @{username} (límite: {limit}, login: {use_login})")
    
    scraper = None
    try:
        scraper = InstagramScraper()
        
        # Obtener posts usando Selenium
        posts = scraper.get_top_posts(username, limit=limit, login_required=use_login)
        
        if posts and len(posts) > 0:
            safe_print(f"[SUCCESS] {len(posts)} posts obtenidos")
            
            # ✅ LIMPIAR POSTS PARA EVITAR ERRORES DE UNICODE
            cleaned_posts = []
            for i, post in enumerate(posts):
                try:
                    if isinstance(post, dict) and post.get('id') and post.get('shortcode'):
                        cleaned_post = clean_post_for_json(post)
                        cleaned_posts.append(cleaned_post)
                        
                        # Mostrar resumen de forma segura
                        likes = post.get('like_count', 0)
                        post_type = post.get('type', 'UNKNOWN')
                        caption = post.get('caption', '')
                        shortcode = post.get('shortcode', 'unknown')
                        has_image = bool(post.get('display_url'))
                        
                        # Truncar caption de forma segura para mostrar
                        caption_preview = safe_str(caption, 50)
                        
                        safe_print(f"  {i+1}. [{post_type}] @{shortcode} - {likes:,} likes - {'📸' if has_image else '❌'} - \"{caption_preview}\"")
                    else:
                        safe_print(f"  {i+1}. [ERROR] Post inválido: falta id o shortcode")
                        
                except Exception as e:
                    safe_print(f"  {i+1}. [ERROR] Error procesando post: {safe_str(str(e))}")
            
            safe_print(f"\n[INFO] Posts válidos: {len(cleaned_posts)}/{len(posts)}")
            
            # ✅ GUARDAR RESULTADOS EN JSON CON ENCODING UTF-8
            output_file = os.path.join(os.path.dirname(__file__), 'instagram_posts.json')
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(cleaned_posts, f, ensure_ascii=False, indent=4)
                safe_print(f"[INFO] Resultados guardados en: {output_file}")
            except Exception as e:
                safe_print(f"[WARN] Error guardando archivo: {safe_str(str(e))}")
            
            # ✅ IMPRIMIR JSON PARA NODE.JS CON MANEJO SEGURO
            safe_print("\n" + "="*50)
            safe_print("JSON_OUTPUT_START")
            try:
                # Usar ensure_ascii=False para mantener caracteres Unicode en JSON
                json_output = json.dumps(cleaned_posts, ensure_ascii=False, separators=(',', ':'))
                print(json_output)  # Usar print directo para el JSON
            except Exception as e:
                safe_print(f"[ERROR] Error generando JSON: {safe_str(str(e))}")
                print("[]")  # JSON vacío como fallback
            safe_print("JSON_OUTPUT_END")
            safe_print("="*50)
            
        else:
            safe_print(f"[WARN] No se pudieron obtener posts para @{username}")
            safe_print(f"[INFO] Posibles causas:")
            safe_print(f"  - El perfil es privado")
            safe_print(f"  - El username no existe")
            safe_print(f"  - Instagram está bloqueando el scraping")
            safe_print(f"  - Problemas de conectividad")
            safe_print(f"  - Los selectores de Instagram han cambiado")
            
            safe_print("\nJSON_OUTPUT_START")
            print("[]")
            safe_print("JSON_OUTPUT_END")
    
    except Exception as e:
        safe_print(f"[ERROR] Error en scraper: {safe_str(str(e))}")
        import traceback
        try:
            safe_print(f"[DEBUG] Traceback completo:")
            traceback.print_exc()
        except:
            safe_print("[ERROR] No se pudo mostrar traceback")
        
        safe_print("\nJSON_OUTPUT_START")
        print("[]")
        safe_print("JSON_OUTPUT_END")
        sys.exit(1)
    
    finally:
        if scraper:
            try:
                scraper.close()
            except Exception as e:
                safe_print(f"[WARN] Error cerrando scraper: {safe_str(str(e))}")
        safe_print("\n[INFO] Scraper finalizado")

if __name__ == "__main__":
    main()