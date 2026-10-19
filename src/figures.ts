import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

// A paragraph holding only an image with a title becomes a figure, the title its caption:
// `![alt](./photo.jpg "caption")`. Posts moved from Blogger use this for captioned photos.
// A linked image (`[![alt](x "t")](link)`) is left alone: its title stays a tooltip.
export function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'p') return;
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      const img = kids[0];
      if (kids.length !== 1 || img.type !== 'element' || img.tagName !== 'img') return;
      const caption = img.properties.title;
      if (typeof caption !== 'string' || !caption) return;
      delete img.properties.title;
      node.tagName = 'figure';
      node.children = [
        img,
        { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] },
      ];
    });
  };
}
