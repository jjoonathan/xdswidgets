xdswidgets
===============================

Miscellaneous widgets for data science.

Installation
------------

To install use pip:

    $ pip install xdswidgets
    $ jupyter nbextension enable --py --sys-prefix xdswidgets


For a development installation (requires npm),

    $ git clone https://github.com/jjoonathan/xdswidgets.git
    $ cd xdswidgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix xdswidgets
    $ jupyter nbextension enable --py --sys-prefix xdswidgets

## Installation - JupyterLab

```bash
jupyter labextension install xdswidgets
```

## Development - JupyterLab

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
