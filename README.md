Miscellaneous jupyterlab widgets for data science. So far, it only contains a single widget, the SelectableImageView.

SelectableImageView displays an image and lets you:
* Draw rectangles (left-drag)
* Delete rectangles (left-click on a rectangle)
* Plant crosshair (left-click)
  * Up to two crosshairs are visible (one from the last click, one from second-to-last click)
* Delete crosshair (double-click)
* Programatically access, mutate, and receive events on the above properties 

Package Install
---------------

**Prerequisites**

* Conda: python3.6 jupyterlab numpy numba pillow nodejs
* NPM: yarn

**Steps**

```bash
pip install .  # Run in root of repo.
cd js
yarn install      # Like npm install; download deps into node_modules
jupyter labextension install .
```


Development Install
-------------------

**Resources**

* [Jupyterlab XKCD Extension Tutorial](https://jupyterlab.readthedocs.io/en/stable/developer/xkcd_extension_tutorial.html)

**Steps**

```bash
pip install -e .  # -e = editable. Run in root of repo.
cd js
jlpm install      # Like npm install; download deps into node_modules
jupyter labextension install . --no-build
jupyter lab --watch
```