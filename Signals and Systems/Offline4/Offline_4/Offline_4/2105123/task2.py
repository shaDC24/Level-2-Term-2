import numpy as np
import time
import matplotlib.pyplot as plt

def pad_to_power_of_2(x):
    N = len(x)
    next_power_of_2 = 1
    while next_power_of_2 < N:
        next_power_of_2 *= 2
    x_padded = np.zeros(next_power_of_2, dtype=complex)
    x_padded[:N] = x
    return x_padded

def discrete_Fourier_Transform(signal):
    N = len(signal)
    X_k = np.zeros(N, dtype=complex)
    twiddle_factor = np.exp((-1j * 2 * np.pi) / N)
    for k in range(N):
        for n in range(N):
            X_k[k] += signal[n] * (twiddle_factor ** (k * n))
    return X_k

def Inverse_discrete_Fourier_Transform(freq_dom_signal):
    N = len(freq_dom_signal)
    x_n = np.zeros(N, dtype=complex)
    twiddle_factor = np.exp((1j * 2 * np.pi) / N)
    for n in range(N):
        for k in range(N):
            x_n[n] += freq_dom_signal[k] * (twiddle_factor ** (k * n))
    return x_n / N

def fast_fourier_transform(signal):
    signal = pad_to_power_of_2(signal)
    N = len(signal)
    if N == 1:
        return signal
    even_fft = fast_fourier_transform(signal[::2])
    odd_fft = fast_fourier_transform(signal[1::2])
    result = np.zeros(N, dtype=complex)
    for k in range(N // 2):
        twiddle_factor = np.exp((-1j * 2 * np.pi * k) / N)
        result[k] = even_fft[k] + twiddle_factor * odd_fft[k]
        result[k + (N // 2)] = even_fft[k] - twiddle_factor * odd_fft[k]
    return result



def iinverse_fast_fourier_transform(signal):
    signal = pad_to_power_of_2(signal)
    N = len(signal)
    if N == 1:
        return signal
    even_fft = iinverse_fast_fourier_transform(signal[::2])
    odd_fft = iinverse_fast_fourier_transform(signal[1::2])
    result = np.zeros(N, dtype=complex)
    for k in range(N // 2):
        twiddle_factor = np.exp(( 2j * np.pi * k) / N)
        result[k] = (even_fft[k] + twiddle_factor * odd_fft[k])
        result[k + (N // 2)] = (even_fft[k] - twiddle_factor * odd_fft[k])  
    return result

def inverse_fast_fourier_transform(signal):
    N = len(signal)
    return iinverse_fast_fourier_transform(signal)/N



def generate_random_discrete_signal(k, value_range=(-10, 10)):
    n = 2**k 
    real_part = np.random.randint(value_range[0], value_range[1] + 1, size=n)
    imag_part = np.random.randint(value_range[0], value_range[1] + 1, size=n)
    signal = real_part + 1j * imag_part
    return signal


def plot(random_signal,dft_signalA_magnitude,fft_signalA_magnitude,idft,ifft):
    plt.figure(figsize=(7, 5))
    plt.stem(np.arange(0,n), np.real(random_signal),linefmt="red", basefmt="r-", markerfmt="o")
    plt.title(f"Random Discrete Signal (Length = {n})")
    plt.xlabel("Sample Index")
    plt.ylabel("Amplitude")
    plt.show()
    
    plt.figure(figsize=(7, 5))
    plt.stem(np.arange(0,n), dft_signalA_magnitude, basefmt=" ", markerfmt="o")
    plt.title("Frequency Spectrum of Signal A (DFT)")
    plt.xlabel("Sample Index")
    plt.ylabel("Magnitude")
    plt.show()
    
    plt.figure(figsize=(7, 5))
    plt.stem(np.arange(0,n), fft_signalA_magnitude, basefmt=" ", markerfmt="o")
    plt.title("Frequency Spectrum of Signal A (FFT)")
    plt.xlabel("Sample Index")
    plt.ylabel("Magnitude")
    plt.show()
    
    plt.figure(figsize=(7, 5))
    plt.stem(np.arange(0,n), np.real(random_signal),linefmt="red", basefmt=" ", markerfmt="o",label="Original")
    plt.stem(np.arange(0,n), np.real(idft),linefmt="blue", basefmt=" ", markerfmt="o",label="IDFT")
    plt.title("Comparison between IDFT and Original")
    plt.xlabel("Sample Index")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.show()
    
    plt.figure(figsize=(7, 5))
    plt.stem(np.arange(0,n), np.real(random_signal),linefmt="red", basefmt=" ", markerfmt="o",label="Original")
    plt.stem(np.arange(0,n), np.real(ifft),linefmt="blue", basefmt=" ", markerfmt="o",label="IFFT")
    plt.title("Comparison between IFFT and Original")
    plt.xlabel("Sample Index")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.show()
    

dft_time=[]
fft_time=[]
idft_time=[]
ifft_time=[]
for k in range(2,12):
    random_signal=generate_random_discrete_signal(k)
    n=(2**k)

    start_time_dft=time.time()
    for i in range(10):
        dft=discrete_Fourier_Transform(random_signal)
    end_time_dft=time.time()
    dft_time.append((end_time_dft-start_time_dft)/10)
    dft_signalA_magnitude=np.abs(dft)

    
    
    start_time_fft=time.time()
    for i in range(10):
        fft=fast_fourier_transform(random_signal)
    end_time_fft=time.time()
    fft_time.append((end_time_fft-start_time_fft)/10)
    fft_signalA_magnitude=np.abs(fft)
    
    
    start_time_idft=time.time()
    for i in range(10):
        idft=Inverse_discrete_Fourier_Transform(dft)
    end_time_idft=time.time()
    idft_time.append((end_time_idft-start_time_idft)/10)

    
    start_time_ifft=time.time()
    for i in range(10):
        ifft=inverse_fast_fourier_transform(fft)
    end_time_ifft=time.time()
    ifft_time.append((end_time_ifft-start_time_ifft)/10)
    
    if(k%2 and k<5):#2,4
        plot(random_signal,dft_signalA_magnitude,fft_signalA_magnitude,idft,ifft)
    elif(k%2!=0 and k>=10):#11
        plot(random_signal,dft_signalA_magnitude,fft_signalA_magnitude,idft,ifft)


sizes=[2**k for k in range(2,12)]

            
plt.figure(figsize=(12, 6))
plt.plot(sizes, dft_time, label="DFT", marker="o")
plt.plot(sizes, fft_time, label="FFT", marker="o")
plt.xlabel("Number of Samples (N)")
plt.ylabel("Computational Complexity")
plt.title("Runtime Comparison of DFT/FFT ")
plt.legend()
plt.show()


plt.figure(figsize=(12, 6))
plt.plot(sizes, dft_time, label="DFT", marker="o")
plt.plot(sizes, fft_time, label="FFT", marker="o")
plt.yscale('log')
plt.xlabel("Number of Samples (N)")
plt.ylabel("Computational Complexity")
plt.title("Runtime Comparison of DFT/FFT(log scale)")
plt.legend()
plt.show()


plt.figure(figsize=(12, 6))
plt.plot(sizes, idft_time, label="IDFT", marker="o")
plt.plot(sizes, ifft_time, label="IFFT", marker="o")
plt.xlabel("Number of Samples (N)")
plt.ylabel("Computational Complexity")
plt.title("Runtime Comparison  IDFT/IFFT")
plt.legend()
plt.show()
    
    
plt.figure(figsize=(12, 6))
plt.plot(sizes, idft_time, label="IDFT", marker="o")
plt.plot(sizes, ifft_time, label="IFFT", marker="o")
plt.yscale('log')
plt.xlabel("Number of Samples (N)")
plt.ylabel("Computational Complexity")
plt.title("Runtime Comparison  IDFT/IFFT")
plt.legend()
plt.show()  

'''
print("Checking......................................................................................")
print("DFT:")
print(dft)
print("FFT:")
print(fft)

print("Original signal:")
print(random_signal)
print("IDFT:")
print(idft)
print("IFFT:")
print(ifft)

'''
