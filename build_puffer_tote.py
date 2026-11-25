"""Quilted puffer tote, "Midnight" - matched to the front-view reference (Puffer Pix / 9.jpg).

Run headless:  python build_puffer_tote.py   (needs the `bpy` package, Blender 4.x/5.x API)
Outputs puffer_tote_midnight.blend + puffer_tote_midnight.png next to this script.
"""
import bpy, bmesh, math, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree

OUT = os.path.dirname(os.path.abspath(__file__)) + "/"
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

W, H, D = 0.40, 0.32, 0.16           # working size (m)
hx, hy, hz = W/2, D/2, H/2
R = 0.04                             # soft corner rounding
PUFF = 0.020                         # cushion loft per quilt panel
CELL = 0.16                          # square quilt panels: 0.16 x 0.16 m
# front: two full squares centred (the reference's 2x2 block) + narrow wrap strips at the corners
X_EDGES = [-hx, -CELL, 0.0, CELL, hx]
Y_EDGES = [-hy, hy]                  # side: one square across the 0.16 m depth
Z_EDGES = [-hz, 0.0, hz]             # two square rows over the 0.32 m height

def clamp(v, a, b): return max(a, min(b, v))

def cushion(a, edges):
    for e0, e1 in zip(edges, edges[1:]):
        if e0 <= a <= e1:
            return math.sin(math.pi * (a - e0) / (e1 - e0))
    return 0.0

# ---------------- body ----------------
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=110, use_grid_fill=True)
ih = Vector((hx-R, hy-R, hz-R))
for v in bm.verts:
    p = Vector((v.co.x*2*hx, v.co.y*2*hy, v.co.z*2*hz))
    q = Vector((clamp(p.x,-ih.x,ih.x), clamp(p.y,-ih.y,ih.y), clamp(p.z,-ih.z,ih.z)))
    d = p - q
    n = d.normalized() if d.length > 1e-9 else Vector((0, 0, 1))
    s = q + n*R
    cx = cushion(s.x, X_EDGES); cy = cushion(s.y, Y_EDGES); cz = cushion(s.z, Z_EDGES)
    front = (cx*cz) ** 0.35           # flat-topped pillows, tight seam channels
    side  = (cy*cz) ** 0.35
    base  = (cx*cy) ** 0.35
    off = PUFF * (n.y**2*front + n.x**2*side + (n.z**2*base if s.z < 0 else 0))
    s += n*off
    # overall pillowy belly on the big panels
    belly = 0.012 * (1-(s.x/hx)**2) * (1-(s.z/hz)**2)
    s.y += math.copysign(belly, s.y) * abs(n.y)
    t = clamp((s.z/hz + 1) / 2, 0.0, 1.0)
    # gathered mouth: top sinks in like an open, cinched tote
    if n.z > 0:
        s.z -= 0.045 * n.z**2 * (1-(s.x/hx)**2) * (1-(s.y/hy)**2)
        s.z += 0.006 * math.sin(s.x*90) * n.z   # gathers along the rim
    s.y *= 1 - 0.22 * t**2.5          # slight pinch in depth at the mouth
    s.x *= 1 + 0.035 * t**2           # reference flares a touch at the top
    s.x *= 1 - 0.05 * (1-t)**6        # tucked-in base band
    v.co = s
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
mn = Vector([min(v.co[i] for v in bm.verts) for i in range(3)])
mx = Vector([max(v.co[i] for v in bm.verts) for i in range(3)])
for v in bm.verts:   # normalise body to the exact working size, sitting on the floor
    v.co.x = (v.co.x - (mn.x+mx.x)/2) * W/(mx.x-mn.x)
    v.co.y = (v.co.y - (mn.y+mx.y)/2) * D/(mx.y-mn.y)
    v.co.z = (v.co.z - mn.z) * H/(mx.z-mn.z)
bm.normal_update()
bvh = BVHTree.FromBMesh(bm)
me = bpy.data.meshes.new("ToteBody"); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new("PufferTote", me); scene.collection.objects.link(body)
print("BODY_ONLY_DIMS", tuple(round(d, 4) for d in body.dimensions))

def front_y(x, z):
    hit = bvh.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
    return hit[0].y if hit[0] else -hy

def catmull(pts, samples):
    out = []
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P)-2):
        p0, p1, p2, p3 = (Vector(P[j]) for j in (i-1, i, i+1, i+2))
        for k in range(samples):
            u = k / samples
            out.append(0.5*((2*p1) + (-p0+p2)*u + (2*p0-5*p1+4*p2-p3)*u*u + (-p0+3*p1-3*p2+p3)*u**3))
    out.append(Vector(pts[-1]))
    return out

def tube(name, pts, radius, gathers_per_m=22):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = radius; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
    L = 0.0
    for i, (pt, c) in enumerate(zip(sp.points, pts)):
        if i: L += (c - pts[i-1]).length
        pt.co = (c.x, c.y, c.z, 1)
        pt.radius = 1 + 0.035*math.sin(2*math.pi*gathers_per_m*L)   # ruched padding
    ob = bpy.data.objects.new(name, cu); scene.collection.objects.link(ob)
    return ob

# short carry handle: rises from the mouth to a pinched peak (reference top loop)
ctrl = [(-0.07, 0.02, H-0.05), (-0.066, 0.02, H+0.02), (-0.05, 0.015, H+0.10), (-0.022, 0.01, H+0.16),
        (0.0, 0.01, H+0.172), (0.022, 0.01, H+0.16), (0.05, 0.015, H+0.10), (0.066, 0.02, H+0.02), (0.07, 0.02, H-0.05)]
h1 = tube("Handle_Top", catmull(ctrl, 14), 0.017)

# long padded strap draping over the front in a slack U (reference front strap)
path2d = [(-0.105, H-0.022), (-0.10, H-0.045), (-0.085, H-0.12), (-0.055, 0.12), (-0.02, 0.075),
          (0.005, 0.06), (0.035, 0.08), (0.07, 0.15), (0.095, H-0.07), (0.105, H-0.045), (0.108, H-0.022)]
strap = []
for p in catmull([(x, 0, z) for x, z in path2d], 16):
    y = front_y(p.x, min(p.z, H-0.012)) - 0.0145
    # strap swings slightly clear of the bag at its lowest point
    y -= 0.01 * clamp(1 - (p.z-0.06)/0.12, 0, 1)
    strap.append(Vector((p.x, y, p.z)))
# tuck both ends over the rim into the mouth
# ends are stitched onto the top of the front panel: sink them into the body
strap = [strap[0] + Vector((0, 0.022, -0.004))] + strap + [strap[-1] + Vector((0, 0.022, -0.004))]
h2 = tube("Handle_FrontStrap", strap, 0.016)

# join into ONE model
bpy.context.view_layer.objects.active = body
for o in (h1, h2): o.select_set(True)
body.select_set(True)
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
body = bpy.context.view_layer.objects.active
body.name = "PufferTote_Midnight"
bpy.ops.object.shade_smooth()
sub = body.modifiers.new("Subsurf", 'SUBSURF'); sub.levels = 1; sub.render_levels = 1

# ---------------- material ----------------
def srgb2lin(c):
    c /= 255.0
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
mat = bpy.data.materials.new("Midnight_Nylon")
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (srgb2lin(0x23), srgb2lin(0x1f), srgb2lin(0x20), 1)  # #231f20
bsdf.inputs["Roughness"].default_value = 0.32
bsdf.inputs["Sheen Weight"].default_value = 0.25
bsdf.inputs["Coat Weight"].default_value = 0.15
# satin nylon crinkle: fine stretched noise -> bump on the BSDF normal (values above untouched)
nt = mat.node_tree
tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
mp.inputs["Scale"].default_value = (1.0, 1.0, 2.2)
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 28.0
nz.inputs["Detail"].default_value = 6.0; nz.inputs["Distortion"].default_value = 0.6
bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.18
bp.inputs["Distance"].default_value = 0.002
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], bsdf.inputs["Normal"])
body.data.materials.append(mat)

# ---------------- studio (warm grey, like the reference backdrop) ----------------
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
floor = bpy.context.object; floor.name = "Studio_Floor"
fm = bpy.data.materials.new("Studio")
fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.50, 0.46, 0.41, 1)
fm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.9
floor.data.materials.append(fm)
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 1.2, 4), rotation=(math.pi/2, 0, 0))
wall = bpy.context.object; wall.name = "Studio_Wall"; wall.data.materials.append(fm)
world = bpy.data.worlds.new("W"); scene.world = world
world.node_tree.nodes["Background"].inputs[0].default_value = (0.5, 0.48, 0.45, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.04

def area(name, loc, energy, size, target=(0, 0, 0.18)):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.size = size
    o = bpy.data.objects.new(name, l); o.location = loc; scene.collection.objects.link(o)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area("Key", (-1.3, -1.2, 1.5), 45, 0.5)
area("Fill", (1.5, -0.9, 0.6), 8, 0.6)
area("Rim", (0.7, 0.9, 1.3), 45, 0.5)
area("Top", (0, -0.2, 2.0), 40, 0.6)
# big soft-box above/behind camera: the satin nylon mirrors it as broad sheen across each pillow
area("Softbox", (-0.35, -1.9, 1.05), 55, 1.4)
area("Wall", (0, 0.2, 1.4), 160, 2.0, target=(0, 1.2, 0.6))
# light linking: the backdrop light only lights the backdrop, so the bag keeps its Midnight depth
bg = bpy.data.collections.new("Backdrop"); scene.collection.children.link(bg)
for o in (floor, wall): bg.objects.link(o)
for o in (floor, wall):            # backdrop stays in shot but is not mirrored by the satin nylon
    o.visible_glossy = False; o.visible_diffuse = False
scene.objects["Wall"].light_linking.receiver_collection = bg

cam_d = bpy.data.cameras.new("Cam"); cam_d.lens = 65
cam = bpy.data.objects.new("Cam", cam_d); scene.collection.objects.link(cam)
cam.location = (0.10, -1.75, 0.36)
cam.rotation_euler = (Vector((0, 0, 0.245)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'; scene.cycles.samples = 128; scene.cycles.use_denoising = True
scene.render.resolution_x = scene.render.resolution_y = 1200
scene.view_settings.view_transform = 'AgX'
scene.render.filepath = OUT + "puffer_tote_midnight.png"
bpy.ops.wm.save_as_mainfile(filepath=OUT + "puffer_tote_midnight.blend")
print("DIMS", tuple(round(d, 3) for d in body.dimensions),
      "MESHES", [o.name for o in scene.objects if o.type == 'MESH'])
bpy.ops.render.render(write_still=True)
print("DONE")
