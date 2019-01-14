from ._version import version_info, __version__

from .SelectableImageWidget import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'xdswidgets',
        'require': 'xdswidgets/extension'
    }]
