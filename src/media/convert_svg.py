import re
import sys

def convert(svg_file, out_file, component_name):
    with open(svg_file, "r") as f:
        content = f.read()

    # extract svg tag contents
    match = re.search(r'<svg[^>]*>([\s\S]*?)</svg>', content)
    if not match:
        print("No SVG tag found")
        return
    
    # get the viewBox attribute
    viewbox_match = re.search(r'viewBox="([^"]+)"', content)
    viewbox = viewbox_match.group(1) if viewbox_match else "0 0 100 100"

    inner = match.group(1)
    
    # remove sodipodi:namedview
    inner = re.sub(r'<sodipodi:namedview[\s\S]*?/>', '', inner)
    
    # replace dash-case to camelCase for some attributes like stop-color, stop-opacity, clip-path
    inner = re.sub(r'stop-color="([^"]+)"', r'stopColor="\1"', inner)
    inner = re.sub(r'stop-opacity="([^"]+)"', r'stopOpacity="\1"', inner)
    inner = re.sub(r'clip-path="([^"]+)"', r'clipPath="\1"', inner)
    inner = re.sub(r'clipPathUnits="([^"]+)"', r'clipPathUnits="\1"', inner)
    inner = re.sub(r'gradientUnits="([^"]+)"', r'gradientUnits="\1"', inner)
    inner = re.sub(r'gradientTransform="([^"]+)"', r'gradientTransform="\1"', inner)
    inner = re.sub(r'spreadMethod="([^"]+)"', r'spreadMethod="\1"', inner)
    # remove inkscape & sodipodi attributes
    inner = re.sub(r'\s+inkscape:[a-zA-Z0-9_-]+="[^"]*"', '', inner)
    inner = re.sub(r'\s+sodipodi:[a-zA-Z0-9_-]+="[^"]*"', '', inner)
    inner = re.sub(r'\s+xml:space="[^"]*"', '', inner)

    tsx = f"""import {{ component$, type PropsOf }} from "@builder.io/qwik";

export const {component_name} = component$<PropsOf<"svg">>((props) => {{
  return (
    <svg
      viewBox="{viewbox}"
      xmlns="http://www.w3.org/2000/svg"
      {{...props}}
    >
      {inner.strip()}
    </svg>
  );
}});
"""
    with open(out_file, "w") as f:
        f.write(tsx)

convert("src/media/redimed-logo.svg", "src/components/icons/LogoFull.tsx", "LogoFull")
convert("src/media/redimed-symbol.svg", "src/components/icons/SymbolRim.tsx", "SymbolRim")
