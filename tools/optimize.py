import os
from PIL import Image

def optimize_images(source_dir, dest_dir, max_size=1800):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    for filename in os.listdir(source_dir):
        if filename.lower().endswith(".png"):
            src_path = os.path.join(source_dir, filename)
            dest_path = os.path.join(dest_dir, filename)
            
            try:
                with Image.open(src_path) as img:
                    img = img.convert("RGBA")
                    
                    # Calculate new size maintaining aspect ratio
                    width, height = img.size
                    if width > max_size or height > max_size:
                        if width > height:
                            new_width = max_size
                            new_height = int(max_size * height / width)
                        else:
                            new_height = max_size
                            new_width = int(max_size * width / height)
                            
                        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                        
                    # Save optimized
                    img.save(dest_path, "PNG", optimize=True)
                    print(f"Optimized: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(base_path, "photos")
    dest = os.path.join(src, "optimized")
    
    print("Starting optimization...")
    optimize_images(src, dest)
    print("Done!")
