Miscellaneous widgets for data science. So far, it only contains a single widget, the SelectableImageView.

SelectableImageView displays an image and lets you:
* Draw rectangles (left-drag)
* Delete rectangles (left-click on a rectangle)
* 

Package Install
---------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
pip install .  # -e = editable. Run in root of repo.
cd js
yarn install      # Like npm install; download deps into node_modules
jupyter labextension install .
```


Development Install
-------------------

Pass `-e` to pip in order to do an "editable" install 

```bash
pip install -e .  # -e = editable. Run in root of repo.
cd js
jlpm install      # Like npm install; download deps into node_modules
jupyter labextension install . --no-build
jupyter lab --watch
```