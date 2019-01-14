import PIL, io, traitlets, ipywidgets, IPython, pkg_resources
import numpy as np
from matplotlib import pyplot as plt

@ipywidgets.register
class SelectableImageWidget(ipywidgets.DOMWidget, traitlets.HasTraits):
    # Metadata
    _view_name            = traitlets.Unicode('SelectableImageView').tag(sync=True)
    _model_name           = traitlets.Unicode('SelectableImageModel').tag(sync=True)
    _view_module          = traitlets.Unicode('xdswidgets').tag(sync=True)
    _model_module         = traitlets.Unicode('xdswidgets').tag(sync=True)
    _view_module_version  = traitlets.Unicode('^0.1.0').tag(sync=True)
    _model_module_version = traitlets.Unicode('^0.1.0').tag(sync=True)

    # Model
    img_bytes             = traitlets.Bytes(help="Image data bytes").tag(sync=True)
    img_fmt               = traitlets.Unicode('null').tag(sync=True)
    select_rects          = traitlets.Bool(True).tag(sync=True)  # If True,
    selected_rects        = traitlets.List([]).tag(sync=True)
    last_click_xy         = traitlets.List([]).tag(sync=True)
    last_click_xy_1       = traitlets.List([]).tag(sync=True)  # Lags last_click_xy by 1

    # Python backend only
    #js_loaded             = False

    def __init__(self):
        super(ipywidgets.DOMWidget, self).__init__()
        self._mouse_move_callback_dispatcher = ipywidgets.CallbackDispatcher()
        #if not SelectableImageWidget.js_loaded:
        #    SelectableImageWidget.load_js()
        #    SelectableImageWidget.js_loaded = True
        self.on_msg(self._handle_msg_sub)

    #@classmethod
    #def load_js(cls):
    #    fname = pkg_resources.resource_filename(__name__,'dist/xds-bluenose-widget.js')
    #    js = open(fname).read()
    #    IPython.core.display.display(IPython.core.display.Javascript(data=js))

    def on_mouse_move(self, callback, remove=False):
        self._mouse_move_callback_dispatcher.register_callback(callback, remove=remove)

    def _handle_msg_sub(this, widget, content, buffers):
        # content = {'event': 'mousedown', 'x': 365, 'y': 28}
        if content['event'] == 'mousemove':
            this._mouse_move_callback_dispatcher(content)

    def set_to_np_cmap(self, np_2darr, colormap_name="jet", normalize=True):
        amin, amax = np.min(np_2darr), np.max(np_2darr)
        np_2darr = (np_2darr-amin)/max(.001,(amax-amin))
        cm = plt.get_cmap(colormap_name)
        XYrgb = cm(np_2darr)
        r = XYrgb[:,:,0]
        g = XYrgb[:,:,1]
        b = XYrgb[:,:,2]
        self.set_to_np_rgb(r,g,b,normalize=False)


    def set_to_np_rgb(this, r_2darr, g_2darr, b_2darr, normalize=False):
        """ [rgb]_2darr should be normalized s.t. the elements in [0,1]. Only one is required non-None. """
        shapes = [arr.shape for arr in (r_2darr, g_2darr, b_2darr) if arr is not None]
        h = shapes[0][0]
        w = shapes[0][1]
        np_rgb = [arr if arr is not None else np.zeros((h, w)) for arr in (r_2darr, g_2darr, b_2darr)]
        np.seterr(divide='ignore', invalid='ignore')
        if normalize:
            np_rgb = [arr/np.max(arr) for arr in np_rgb]
        pil_rgb = [PIL.Image.fromarray((arr * 255).astype('uint8')) for arr in np_rgb]
        pil_im = PIL.Image.merge('RGB', pil_rgb)
        imPngBytesIO = io.BytesIO()
        pil_im.save(imPngBytesIO, format='png')
        imPngBytes = imPngBytesIO.getvalue()
        this.img_bytes = imPngBytes
        this.img_fmt = 'png'
        imPngBytes = imPngBytesIO.getvalue()