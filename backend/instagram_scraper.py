

# import sys
# import json
# import os
# from scraper.instagram import InstagramScraper

# def main():
#     if len(sys.argv) < 2:
#         print("[ERROR] Uso: python instagram_scraper.py <username> [limit]")
#         sys.exit(1)
    
#     username = sys.argv[1]
#     limit = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    
#     print(f"[INFO] Iniciando scraper para @{username} (límite: {limit})")
    
#     scraper = InstagramScraper()
#     try:
#         # Obtener posts usando Selenium
#         posts = scraper.get_top_posts(username, limit=limit)
        
#         if posts and len(posts) > 0:
#             print(f"[SUCCESS] {len(posts)} posts obtenidos")
            
#             # Mostrar resumen de posts
#             print("\n[INFO] Resumen de posts obtenidos:")
#             for i, post in enumerate(posts, 1):
#                 likes = post.get('like_count', 0)
#                 caption_preview = (post.get('caption', '')[:50] + '...') if len(post.get('caption', '')) > 50 else post.get('caption', '')
#                 print(f"  {i}. {likes:,} likes - \"{caption_preview}\"")
            
#             # Guardar resultados en JSON
#             output_file = os.path.join(os.path.dirname(__file__), 'instagram_posts.json')
#             with open(output_file, "w", encoding="utf-8") as f:
#                 json.dump(posts, f, ensure_ascii=False, indent=4)
            
#             print(f"[INFO] Resultados guardados en: {output_file}")
            
#             # Imprimir en la salida estándar para que Node.js pueda capturarlo
#             print("\n" + "="*50)
#             print("JSON_OUTPUT_START")
#             print(json.dumps(posts, ensure_ascii=False))
#             print("JSON_OUTPUT_END")
#             print("="*50)
            
#         else:
#             print(f"[WARN] No se pudieron obtener posts para @{username}")
#             print("\nJSON_OUTPUT_START")
#             print("[]")
#             print("JSON_OUTPUT_END")
            
#     except Exception as e:
#         print(f"[ERROR] Error en scraper: {e}")
#         print("\nJSON_OUTPUT_START")
#         print("[]")
#         print("JSON_OUTPUT_END")
#         sys.exit(1)
#     finally:
#         scraper.close()
#         print("\n[INFO] Scraper finalizado")

# if __name__ == "__main__":
#     main()

# backend/instagram_scraper.py
import sys
import json
import os

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
        print("[ERROR] No se puede importar InstagramScraper")
        print("[DEBUG] Verificar que existe el archivo scraper/instagram.py")
        print(f"[DEBUG] Directorio actual: {current_dir}")
        print(f"[DEBUG] Buscando en: {scraper_dir}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Uso: python instagram_scraper.py <username> [limit] [login]")
        print("[EXAMPLE] python instagram_scraper.py montsepos 6 false")
        sys.exit(1)
    
    username = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    use_login = sys.argv[3].lower() == 'true' if len(sys.argv) > 3 else False
    
    print(f"[INFO] Iniciando scraper para @{username} (límite: {limit}, login: {use_login})")
    
    scraper = None
    try:
        scraper = InstagramScraper()
        
        # Obtener posts usando Selenium
        posts = scraper.get_top_posts(username, limit=limit, login_required=use_login)
        
        if posts and len(posts) > 0:
            print(f"[SUCCESS] {len(posts)} posts obtenidos")
            
            # Mostrar resumen de posts
            print("\n[INFO] Resumen de posts obtenidos:")
            for post in posts: #in enumerate(posts, 1):
                likes = post.get('like_count', 0)
                post_type = post.get('type', 'IMAGE')
                caption_preview = (post.get('caption', '')[:50] + '...') if len(post.get('caption', '')) > 50 else post.get('caption', '')
                print(post)
                # print(f"  {i}. [{post_type}] {likes:,} likes - \"{caption_preview}\"")
            
            # Guardar resultados en JSON
            output_file = os.path.join(os.path.dirname(__file__), 'instagram_posts.json')
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(posts, f, ensure_ascii=False, indent=4)
            
            print(f"\n[INFO] Resultados guardados en: {output_file}")
            
            # Imprimir JSON para Node.js
            print("\n" + "="*50)
            print("JSON_OUTPUT_START")
            print(json.dumps(posts, ensure_ascii=False))
            print("JSON_OUTPUT_END")
            print("="*50)
            
        else:
            print(f"[WARN] No se pudieron obtener posts para @{username}")
            print(f"[INFO] Posibles causas:")
            print(f"  - El perfil es privado")
            print(f"  - El username no existe")
            print(f"  - Instagram está bloqueando el scraping")
            print(f"  - Problemas de conectividad")
            
            print("\nJSON_OUTPUT_START")
            print("[]")
            print("JSON_OUTPUT_END")
    
    except Exception as e:
        print(f"[ERROR] Error en scraper: {e}")
        import traceback
        print(f"[DEBUG] Traceback completo:")
        traceback.print_exc()
        
        print("\nJSON_OUTPUT_START")
        print("[]")
        print("JSON_OUTPUT_END")
        sys.exit(1)
    
    finally:
        if scraper:
            try:
                scraper.close()
            except:
                pass
        print("\n[INFO] Scraper finalizado")

if __name__ == "__main__":
    main()