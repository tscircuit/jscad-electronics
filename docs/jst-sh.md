# JST SH top-entry header

`JstSh` models the **BMxxB-SRSS-TB** top-entry SH header, not every JST family.
The [JST SH drawing](https://www.jst-mfg.com/product/pdf/eng/eSH.pdf), page 3,
specifies 1 mm contact pitch, body width `(N - 1) + 3` mm, 2.9 mm depth and
4.25 mm height. The housing has an open mating cavity, keyed entry notches,
N tin-plated contacts and two side hold-downs. The 12-position envelope was also
checked against [modelcdn C160398](https://modelcdn.tscircuit.com/easyeda_models/assets/C160398.obj).

Named `jstN_sh` strings route directly. A generic `jstN_smd` string routes here
only when both the 1 mm pitch and SH top-entry mounting geometry agree
(mount span `N - 1 + 2.6` mm and mount-row offset 2.525 mm, within tolerances).
This recovers the pad-derived BM12B footprint without assigning an SH body to
unrelated FPC, terminal block or other JST patterns. Pitch alone is insufficient.
The existing PH, ZH and XH routes are preserved. Other series and SH side-entry
remain separate modeling work.

Fixtures: 2 contacts, 6 contacts, 12 pad-derived contacts and a rotated 4-contact
footprint. Each is one six-view composite. Tests check the physical envelope,
contact and hold-down counts, open cavity and conservative generic routing.
