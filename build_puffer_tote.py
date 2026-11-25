import bpy, bmesh, math
from mathutils import Vector

OUT = "/home/user/Claude-Code/"
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

W, H, D = 0.40, 0.32, 0.16          # working size (m)
hx, hy, hz = W/2, D/2, H/2
R = 0.035                            # corner rounding
PUFF = 0.011                         # cushion height per quilt panel
CELL = 0.08                          # square quilt panel size

def clamp(v, a, b): return max(a, min(b, v))

def cushion(a, size, half):
    n = max(1, round(2*half/size))
    f = ((a + half) / (2*half)) * n
    fr = f - math.floor(f)
    return math.sin(math.pi * clamp(fr, 0, 1))

# ---------- body ----------
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=95, use_grid_fill=True)
ih = Vector((hx-R, hy-R, hz-R))
for v in bm.verts:
    p = Vector((v.co.x*2*hx, v.co.y*2*hy, v.co.z*2*hz))
    q = Vector((clamp(p.x,-ih.x,ih.x), clamp(p.y,-ih.y,ih.y), clamp(p.z,-ih.z,ih.z)))
    d = p - q
    n = d.normalized() if d.length > 1e-9 else Vector((0,0,1))
    s = q + n*R
    # quilted cushions, weighted by which face we are on
    cx = cushion(s.x, CELL, hx); cy = cushion(s.y, CELL, hy); cz = cushion(s.z, CELL, hz)
    front = (cx*cz) ** 0.5
    side  = (cy*cz) ** 0.5
    base  = (cx*cy) ** 0.5
    off = PUFF * (n.y**2*front + n.x**2*side + n.z**2*base*(1 if s.z < 0 else 0.4))
    # overall pillowy belly on the big panels
    belly = 0.018 * (1-(s.x/hx)**2) * (1-(s.z/hz)**2)
    s += n*off
    s.y += math.copysign(belly, s.y) * abs(n.y)
    # top pinches in (tote mouth), bottom stays full
    t = clamp((s.z/hz + 1) / 2, 0.0, 1.0)
    s.y *= 1 - 0.55 * t**2.2
    s.x *= 1 - 0.05 * t
    v.co = s + Vector((0, 0, hz))   # sit on the ground
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
# normalise body to the exact working size
mn = Vector([min(v.co[i] for v in bm.verts) for i in range(3)])
mx = Vector([max(v.co[i] for v in bm.verts) for i in range(3)])
tgt = (W, D, H)
for v in bm.verts:
    v.co.x = (v.co.x - (mn.x+mx.x)/2) * tgt[0]/(mx.x-mn.x)
    v.co.y = (v.co.y - (mn.y+mx.y)/2) * tgt[1]/(mx.y-mn.y)
    v.co.z = (v.co.z - mn.z) * tgt[2]/(mx.z-mn.z)
TOPY = max(abs(v.co.y) for v in bm.verts if v.co.z > H-0.03)
me = bpy.data.meshes.new("ToteBody"); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new("PufferTote", me); scene.collection.objects.link(body)
for pl in me.polygons: pl.use_smooth = True

# ---------- padded tube handles ----------
def top_y(x):  # approximate front surface y near the top
    return hy * (1 - 0.55) + 0.006

handles = []
for side in (1, -1):
    cu = bpy.data.curves.new(f"Handle{'F' if side>0 else 'B'}", 'CURVE')
    cu.dimensions = '3D'; cu.bevel_depth = 0.014; cu.bevel_resolution = 6
    cu.use_fill_caps = True; cu.resolution_u = 24
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
    y = side * (TOPY - 0.004)
    pts = [(-0.105, y, H-0.035), (0.0, y, H+0.20), (0.105, y, H-0.035)]
    hnd = [((-0.112, y, H-0.07), (-0.095, y, H+0.04)),
           ((-0.085, y, H+0.20), (0.085, y, H+0.20)),
           ((0.095, y, H+0.04), (0.112, y, H-0.07))]
    for bp, co, (l, r) in zip(sp.bezier_points, pts, hnd):
        bp.co = co; bp.handle_left = l; bp.handle_right = r
        bp.handle_left_type = bp.handle_right_type = 'FREE'
    ob = bpy.data.objects.new(cu.name, cu); scene.collection.objects.link(ob)
    handles.append(ob)

# convert handles to mesh and join into ONE model
bpy.context.view_layer.objects.active = body
for o in handles: o.select_set(True)
body.select_set(True)
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
body = bpy.context.view_layer.objects.active
body.name = "PufferTote_Midnight"
bpy.ops.object.shade_smooth()
sub = body.modifiers.new("Subsurf", 'SUBSURF'); sub.levels = 1; sub.render_levels = 1

# ---------- material ----------
def srgb2lin(c):
    c /= 255.0
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
mat = bpy.data.materials.new("Midnight_Nylon"); mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (srgb2lin(0x23), srgb2lin(0x1f), srgb2lin(0x20), 1)
bsdf.inputs["Roughness"].default_value = 0.32
bsdf.inputs["Sheen Weight"].default_value = 0.25
bsdf.inputs["Coat Weight"].default_value = 0.15
body.data.materials.append(mat)

# ---------- studio ----------
bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
floor = bpy.context.object; floor.name = "Studio_Floor"
fm = bpy.data.materials.new("Studio"); fm.use_nodes = True
fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.55, 0.53, 0.51, 1)
fm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.8
floor.data.materials.append(fm)
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.55, 0.54, 0.53, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.04

def area(name, loc, energy, size, rot_target=(0, 0, 0.18)):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.size = size
    o = bpy.data.objects.new(name, l); o.location = loc; scene.collection.objects.link(o)
    o.rotation_euler = (Vector(rot_target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area("Key", (-1.4, -1.0, 1.5), 60, 0.5)
area("Fill", (1.6, -0.6, 0.6), 12, 0.6)
area("Rim", (0.6, 1.3, 1.2), 60, 0.5)
area("Top", (0, 0.3, 2.0), 40, 0.6)

cam_d = bpy.data.cameras.new("Cam"); cam_d.lens = 70
cam = bpy.data.objects.new("Cam", cam_d); scene.collection.objects.link(cam)
cam.location = (0.42, -1.55, 0.42)
cam.rotation_euler = (Vector((0, 0, 0.24)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'; scene.cycles.samples = 128; scene.cycles.use_denoising = True
scene.render.resolution_x = scene.render.resolution_y = 1200
scene.view_settings.view_transform = 'AgX'
scene.render.filepath = OUT + "puffer_tote_midnight.png"
bpy.ops.wm.save_as_mainfile(filepath=OUT + "puffer_tote_midnight.blend")

dims = body.dimensions
bb=[body.matrix_world@Vector(c) for c in body.bound_box]
print("DIMS", tuple(round(d, 3) for d in dims), "OBJECTS",
      [o.name for o in scene.objects if o.type == 'MESH'])
bpy.ops.render.render(write_still=True)
print("DONE")
