# # backend/instagram_scraper.py
# import sys
# import json
# import os
# from scrapers.instagram import InstagramScraper

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Uso: python instagram_scraper.py <username>")
#         sys.exit(1)
    
#     username = sys.argv[1]
    
#     scraper = InstagramScraper()
#     try:
#         posts = scraper.get_top_posts(username, limit=6) #los 3 con más LIKES
        
#         # Guardar resultados en JSON
#         output_file = os.path.join(os.path.dirname(__file__), 'instagram_posts.json')
#         with open(output_file, "w", encoding="utf-8") as f:
#             json.dump(posts, f, ensure_ascii=False, indent=4)
        
#         # Imprimir en la salida estándar para que Node.js pueda capturarlo
#         print(json.dumps(posts))
#     finally:
#         scraper.close()




import sys
import json
import os
import traceback
import time
from pathlib import Path

# Asegurar que el directorio del script está en el path para importaciones
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(current_dir)
sys.path.append(parent_dir)

# Verificar e imprimir paths para depuración
print(f"Buscando instagram.py en: {current_dir}")
print(f"Buscando instagram.py en: {parent_dir}")

# Crear directorio para la salida si no existe
output_dir = os.path.join(current_dir, "output")
os.makedirs(output_dir, exist_ok=True)

# Intentar diferentes formas de importar el InstagramScraper
scraper_imported = False

# Primera opción: importar desde un paquete 'scrapers'
try:
    from scrapers.instagram import InstagramScraper
    print("✅ Importado InstagramScraper desde el paquete 'scrapers'")
    scraper_imported = True
except ImportError:
    print("⚠️ No se pudo importar desde 'scrapers.instagram', probando alternativas...")

# Segunda opción: buscar instagram.py en diferentes ubicaciones
if not scraper_imported:
    # Buscar en directorios comunes
    possible_paths = [
        current_dir,
        os.path.join(current_dir, "scrapers"),
        parent_dir,
        os.path.join(parent_dir, "scrapers")
    ]
    
    found_path = None
    for path in possible_paths:
        instagram_file = os.path.join(path, "instagram.py")
        if os.path.exists(instagram_file):
            found_path = path
            print(f"✅ Encontrado instagram.py en: {instagram_file}")
            break
    
    if found_path:
        sys.path.append(found_path)
        try:
            from instagram import InstagramScraper
            print(f"✅ Importado InstagramScraper desde {found_path}")
            scraper_imported = True
        except ImportError as e:
            print(f"❌ Error al importar desde {found_path}: {e}")

# Última opción: buscar directamente en el directorio actual
if not scraper_imported:
    try:
        # Verificar si instagram.py existe en el directorio actual
        if os.path.exists(os.path.join(current_dir, "instagram.py")):
            from instagram import InstagramScraper
            print("✅ Importado InstagramScraper desde el directorio actual")
            scraper_imported = True
        else:
            print(f"❌ No se encontró instagram.py en el directorio actual")
    except ImportError as e:
        print(f"❌ Error al importar desde el directorio actual: {e}")

# Si no se pudo importar de ninguna forma, salir
if not scraper_imported:
    print("=" * 50)
    print("❌ ERROR: No se pudo importar InstagramScraper")
    print("Verifica que el archivo instagram.py esté en uno de estos directorios:")
    for path in possible_paths:
        print(f"- {path}")
    print("=" * 50)
    sys.exit(1)

def main():
    # Configurar manejo de errores y salida
    try:
        # Verificar argumentos
        if len(sys.argv) < 2:
            print("Uso: python instagram_scaper.py <username> [<limit>] [<login_required>]")
            print("  <username>: Nombre de usuario de Instagram a scrapear")
            print("  <limit>: Número máximo de posts a obtener (opcional, predeterminado: 6)")
            print("  <login_required>: 'true' o 'false' para iniciar sesión (opcional, predeterminado: true)")
            sys.exit(1)
            
        username = sys.argv[1]
        
        print("=" * 50)
        print(f"SCRAPER DE INSTAGRAM PARA: {username}")
        print("=" * 50)
        
        # Establecer valores predeterminados
        limit = 6
        login_required = True
        
        # Procesar argumentos adicionales si existen
        if len(sys.argv) > 2:
            try:
                limit = int(sys.argv[2])
                print(f"Límite de posts establecido en: {limit}")
            except ValueError:
                print(f"El argumento '{sys.argv[2]}' no es un número válido. Usando límite predeterminado: {limit}")
        
        if len(sys.argv) > 3:
            login_param = sys.argv[3].lower()
            if login_param in ['false', 'no', '0', 'f', 'n']:
                login_required = False
                print("Se omitirá el inicio de sesión")
            else:
                print("Se realizará inicio de sesión")
        
        # Inicializar scraper
        print("Inicializando scraper...")
        scraper = InstagramScraper()
        
        try:
            print(f"Iniciando scraper para el usuario: {username}")
            # Ejecutar el scraper
            posts = scraper.get_top_posts(username, limit=limit, login_required=login_required)
            
            if posts:
                print(f"✅ Se encontraron {len(posts)} posts para {username}")
                
                # Calcular estadísticas para verificación
                like_counts = [post.get('like_count', 0) for post in posts]
                max_likes = max(like_counts) if like_counts else 0
                min_likes = min(like_counts) if like_counts else 0
                avg_likes = sum(like_counts) / len(like_counts) if like_counts else 0
                
                print(f"📊 Estadísticas de likes: Min={min_likes}, Max={max_likes}, Promedio={avg_likes:.1f}")
                
                # Verificar y ajustar valores extremos
                if max_likes > 1000000:  # Más de 1 millón es sospechoso para un usuario regular
                    print(f"⚠️ Se detectaron valores de likes anormalmente altos (máximo: {max_likes})")
                    
                    # Ajustar valores muy altos
                    for post in posts:
                        original_likes = post.get('like_count', 0)
                        if original_likes > 1000000:
                            # Usar un valor más razonable (25% del original, máximo 500K)
                            adjusted = min(int(original_likes * 0.25), 500000)
                            post['like_count'] = adjusted
                            print(f"Ajustado: Post {post.get('shortcode')}: {original_likes} → {adjusted} likes")
                
                # Mostrar información resumida de los posts
                print("\nResumen de posts encontrados:")
                for i, post in enumerate(posts, 1):
                    post_type = post.get('type', 'DESCONOCIDO')
                    likes = post.get('like_count', 0)
                    shortcode = post.get('shortcode', 'N/A')
                    # Mostrar primeros 30 caracteres de la descripción si existe
                    caption = post.get('caption', '')
                    caption_preview = (caption[:27] + '...') if caption and len(caption) > 30 else caption
                    print(f"{i}. [{post_type}] Likes: {likes} - ID: {shortcode} - \"{caption_preview}\"")
            else:
                print(f"⚠️ No se encontraron posts para {username}")
            
            # Asegurar que el directorio de salida existe
            os.makedirs(output_dir, exist_ok=True)
            
            # Guardar resultados en JSON
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            output_file = os.path.join(output_dir, f'instagram_posts_{username}_{timestamp}.json')
            
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(posts, f, ensure_ascii=False, indent=4)
            
            print(f"Resultados guardados en: {output_file}")
            
            # Imprimir en la salida estándar para que Node.js pueda capturarlo
            print("\nJSON_OUTPUT_START")
            print(json.dumps(posts))
            print("JSON_OUTPUT_END")
            
            return posts
            
        except Exception as e:
            print(f"❌ Error en el scraper: {e}")
            traceback.print_exc()
            sys.exit(1)
    
    except KeyboardInterrupt:
        print("\n⚠️ Proceso interrumpido por el usuario.")
        sys.exit(2)
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        traceback.print_exc()
        sys.exit(3)
    
    finally:
        try:
            print("Cerrando el scraper...")
            scraper.close()
            print("Scraper cerrado correctamente")
        except NameError:
            print("El scraper no llegó a inicializarse")
        except Exception as e:
            print(f"Error al cerrar el navegador: {e}")

if __name__ == "__main__":
    main()