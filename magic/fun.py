import cv2
import numpy as np
from skimage import feature
from matplotlib import pyplot as plt
from scipy import ndimage as ndi

# Load image
Img = cv2.imread('pictures/fancy.jpg',0)



gaussian1 = ndi.filters.gaussian_filter(Img, 1)
gaussian2 = ndi.filters.gaussian_filter(Img, 2)
gaussian3 = ndi.filters.gaussian_filter(Img, 3)
gaussian4 = ndi.filters.gaussian_filter(Img, 4)
gaussian5 = ndi.filters.gaussian_filter(Img, 5)
gaussian6 = ndi.filters.gaussian_filter(Img, 6)
gaussian7 = ndi.filters.gaussian_filter(Img, 7)
gaussian8 = ndi.filters.gaussian_filter(Img, 8)
gaussian9 = ndi.filters.gaussian_filter(Img, 9)
gaussian10 = ndi.filters.gaussian_filter(Img, 10)

plt.figure(1)
plt.imshow(gaussian1, cmap = 'gray')

plt.figure(2)
plt.imshow(gaussian2, cmap = 'gray')

plt.figure(3)
plt.imshow(gaussian3, cmap = 'gray')

plt.figure(4)
plt.imshow(gaussian4, cmap = 'gray')

plt.figure(5)
plt.imshow(gaussian5, cmap = 'gray')

plt.figure(6)
plt.imshow(gaussian6, cmap = 'gray')

plt.figure(7)
plt.imshow(gaussian7, cmap = 'gray')

plt.figure(8)
plt.imshow(gaussian8, cmap = 'gray')

plt.figure(9)
plt.imshow(gaussian9, cmap = 'gray')

plt.figure(10)
plt.imshow(gaussian10, cmap = 'gray')

plt.figure(11)
plt.imshow(Img, cmap = 'gray')

plt.show()