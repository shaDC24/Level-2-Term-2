import numpy as np
import matplotlib.pyplot as plt
n=50
samples = np.arange(n) 
sampling_rate=100
wave_velocity=8000

#use this function to generate signal_A and signal_B with a random shift
def generate_signals(frequency=5):
    noise_freqs = [15, 30, 45]  # Default noise frequencies in Hz
    amplitudes = [0.5, 0.3, 0.1]  # Default noise amplitudes
    noise_freqs2 = [10, 20, 40] 
    amplitudes2 = [0.3, 0.2, 0.1]
    
     # Discrete sample indices
    dt = 1 / sampling_rate  # Sampling interval in seconds
    time = samples * dt  # Time points corresponding to each sample

    # Original clean signal (sinusoidal)
    original_signal = np.sin(2 * np.pi * frequency * time)

    # Adding noise
    noise_for_sigal_A = sum(amplitude * np.sin(2 * np.pi * noise_freq * time)
                for noise_freq, amplitude in zip(noise_freqs, amplitudes))
    noise_for_sigal_B = sum(amplitude * np.sin(2 * np.pi * noise_freq * time)
                for noise_freq, amplitude in zip(noise_freqs2, amplitudes2))
    signal_A = original_signal + noise_for_sigal_A 
    noisy_signal_B = signal_A + noise_for_sigal_B

    # Applying random shift
    shift_samples = np.random.randint(-n // 2, n // 2)  # Random shift
    print(f"Shift Samples: {shift_samples}")
    signal_B = np.roll(noisy_signal_B, shift_samples)
    
    
    return signal_A, signal_B

#implement other functions and logic

def discrete_Fourier_Transform(signal):
    N=len(signal)
    X_k=np.zeros(N,dtype=complex)
    twiddle_factor=np.exp((-1j*2*np.pi)/N)
    for k in range(N):
        for n in range(N):
            X_k[k]+=signal[n]*(twiddle_factor**(k*n))
    return X_k

signalA,signalB=generate_signals()
plt.figure(figsize=(7, 5))
plt.stem(samples, signalA, basefmt=" ", markerfmt="o")
plt.title("Signal A( Station A)")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.show()

dft_signalA=discrete_Fourier_Transform(signalA)
dft_signalA_magnitude=np.abs(dft_signalA)
plt.figure(figsize=(7, 5))
plt.stem(samples, dft_signalA_magnitude, basefmt=" ", markerfmt="o")
plt.title("Frequency Spectrum of Signal A")
plt.xlabel("Sample Index")
plt.ylabel("Magnitude")
plt.show()


plt.figure(figsize=(7, 5))
plt.stem(samples, signalB,linefmt="red", basefmt=" ", markerfmt="o")
plt.title("Signal B( Station B)")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.show()

dft_signalB=discrete_Fourier_Transform(signalB)
dft_signalB_magnitude=np.abs(dft_signalB)
plt.figure(figsize=(7, 5))
plt.stem(samples, dft_signalB_magnitude,linefmt="red", basefmt=" ", markerfmt="o")
plt.title("Frequency Spectrum of Signal B")
plt.xlabel("Sample Index")
plt.ylabel("Magnitude")
plt.show()

def Inverse_discrete_Fourier_Transform(freq_dom_signal):
    N=len(freq_dom_signal)
    x_n=np.zeros(N,dtype=complex)
    twiddle_factor=np.exp((-1j*2*np.pi)/N)
    for n in range(N):
        for k in range(N):
            x_n[n]+=freq_dom_signal[k]*(twiddle_factor**(-1*k*n))
    return x_n/N


signalA_after_inv=Inverse_discrete_Fourier_Transform(dft_signalA)
plt.figure(figsize=(7, 5))
plt.stem(samples, signalA_after_inv.real,linefmt="blue", basefmt=" ", markerfmt="o",label="IDFT( [DFT(Signal)])")
plt.stem(samples, signalA,linefmt="red", basefmt=" ", markerfmt="o",label="Signal")
plt.title("Comparison between Signal A and IDFT")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()

signalB_after_inv=Inverse_discrete_Fourier_Transform(dft_signalB)
plt.figure(figsize=(7, 5))
plt.stem(samples, signalB_after_inv.real,linefmt="blue", basefmt=" ", markerfmt="o",label="IDFT( [DFT(Signal)])")
plt.stem(samples, signalB,linefmt="red", basefmt=" ", markerfmt="o",label="Signal")
plt.title("Comparison between Signal B and IDFT")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()


def cross_correlation(signalA,signalB):
    X_k=discrete_Fourier_Transform(signalA)
    Y_k=discrete_Fourier_Transform(signalB)
    r_n=Inverse_discrete_Fourier_Transform(X_k*np.conj(Y_k))
    return r_n.real

dft_based_cross_correlation=cross_correlation(signalA,signalB)
plt.figure(figsize=(7, 5))
plt.stem(np.arange(-n//2,n//2), dft_based_cross_correlation, linefmt="green", basefmt=" ", markerfmt="o")
plt.title("DFT-based Cross-Correlation")
plt.xlabel("Lag (Samples)")
plt.ylabel("Correlation")
plt.show()

lag=np.argmax(dft_based_cross_correlation)
print("Index with max amplitude : ",lag)
shift_lag=lag if (lag<=(n//2)) else (lag-n)
print("Sample lag from the calculated : ",shift_lag)
distance=np.abs(shift_lag)*(1/sampling_rate)*wave_velocity
print("Distance : ",distance)


#Starting Bonus Task.....
print("\nStarting Bonus Task.....\n")

def generate_signals2(frequency=10):

    noise_freqs = [10, 25, 50]  
    amplitudes = [0.6, 0.4, 0.2]  
    noise_freqs2 = [95, 105, 305]  
    amplitudes2 = [0.5, 0.3, 0.2]


    dt = 1 / sampling_rate
    time = samples * dt
    original_signal = np.sin(2 * np.pi * frequency * time)

    noise_for_signal_A = sum(amplitude * np.sin(2 * np.pi * noise_freq * time)
                             for noise_freq, amplitude in zip(noise_freqs, amplitudes))
    noise_for_signal_B = sum(amplitude * np.sin(2 * np.pi * noise_freq * time)
                             for noise_freq, amplitude in zip(noise_freqs2, amplitudes2))
    signal_A = original_signal + noise_for_signal_A
    noisy_signal_B = signal_A + noise_for_signal_B

    shift_samples = np.random.randint(-n // 2, n // 2)
    print(f"Shift Samples: {shift_samples}")
    signal_B = np.roll(noisy_signal_B, shift_samples)

    return signal_A, signal_B


def compute_frequency_bins(N, sampling_rate):
    delta_t = 1 / sampling_rate
    freqs = np.zeros(N)
    for k in range(N):
        if k <= N // 2:
            freqs[k] = k / (N * delta_t)
        else:
            freqs[k] = (k - N) / (N * delta_t)   
    return freqs


def low_pass_filter(signal, cutoff=10, sampling_rate=100):
    N=len(signal)
    freq=compute_frequency_bins(N,sampling_rate)
    dft_signal=discrete_Fourier_Transform(signal)
    filtered_dft_signal = np.zeros_like(dft_signal)
    for k in range(N):
        if np.abs(freq[k]) <= cutoff: 
            filtered_dft_signal[k] = dft_signal[k]
    filtered_signal=Inverse_discrete_Fourier_Transform(filtered_dft_signal).real
    return filtered_signal        
    




signalA, signalB = generate_signals2()

extra_noise = 0.4 * np.sin(2 * np.pi * 25 * samples / sampling_rate)
signalA_noisy = signalA + extra_noise



signalA_filtered = low_pass_filter(signalA_noisy)
signalB_filtered = low_pass_filter(signalB)

plt.figure(figsize=(10, 6))
plt.plot(samples, signalA_noisy, label="Noisy Signal A", linestyle="--", color="red")
plt.plot(samples, signalA_filtered, label="Filtered Signal A", color="blue")
plt.title("Impact of Filtering on Signal A")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()

plt.figure(figsize=(10, 6))
plt.plot(samples, signalA, label="Signal A", linestyle="--", color="red")
plt.plot(samples, signalA_filtered, label="Filtered Signal A", color="blue")
plt.title("Original VS Filtered Signal A")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()

plt.figure(figsize=(10, 6))
plt.plot(samples, signalA, label="Signal A", linestyle="--", color="red")
plt.plot(samples, signalA_filtered, label="Filtered Signal A", color="blue")
plt.plot(samples, signalA_noisy, label="Noisy Signal A", linestyle="--", color="green")
plt.title("Original VS Filtered Signal A VS Noisy Signal A")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()

plt.figure(figsize=(10, 6))
plt.plot(samples, signalB, label="Signal B", linestyle="--", color="red")
plt.plot(samples, signalB_filtered, label="Filtered Signal B", color="blue")
plt.title("Impact of Filtering on Signal B")
plt.xlabel("Sample Index")
plt.ylabel("Amplitude")
plt.legend()
plt.show()


filtered_cross_correlation = cross_correlation(signalA_filtered, signalB_filtered)
plt.figure(figsize=(10, 6))
plt.stem(np.arange(-n // 2, n // 2), filtered_cross_correlation, linefmt="green", basefmt=" ", markerfmt="o")
plt.title("Cross-Correlation After Filtering")
plt.xlabel("Lag (Samples)")
plt.ylabel("Correlation")
plt.show()

filtered_cross_correlation_flt_bfr = cross_correlation(signalA, signalB)
plt.figure(figsize=(10, 6))
plt.stem(np.arange(-n // 2, n // 2), filtered_cross_correlation_flt_bfr, linefmt="green", basefmt=" ", markerfmt="o")
plt.title("Cross-Correlation Before Filtering")
plt.xlabel("Lag (Samples)")
plt.ylabel("Correlation")
plt.show()


print("\nSample lag from cross correlation before filtering.....")
lag_filtered = np.argmax(filtered_cross_correlation_flt_bfr)
shift_lag_filtered = lag_filtered if (lag_filtered <= (n // 2)) else (lag_filtered - n)
print("Sample lag index before filtering: ", lag_filtered)
print("Sample lag before filtering: ", shift_lag_filtered)
distance_filtered = np.abs(shift_lag_filtered) * (1 / sampling_rate) * wave_velocity
print("Distance before filtering: ", distance_filtered)

print("\nSample lag from cross correlation after filtering.....")
lag_filtered = np.argmax(filtered_cross_correlation)
shift_lag_filtered = lag_filtered if (lag_filtered <= (n // 2)) else (lag_filtered - n)
print("Sample lag index after filtering: ", lag_filtered)
print("Sample lag after filtering: ", shift_lag_filtered)
distance_filtered = np.abs(shift_lag_filtered) * (1 / sampling_rate) * wave_velocity
print("Distance after filtering: ", distance_filtered)

plt.figure(figsize=(10, 6))
plt.stem(np.arange(-n // 2, n // 2), filtered_cross_correlation_flt_bfr, linefmt="green", basefmt=" ", markerfmt="o",label="Before Fltr")
plt.stem(np.arange(-n // 2, n // 2), filtered_cross_correlation, linefmt="orange", basefmt=" ", markerfmt="o",label="After Fltr")
plt.title("Cross-Correlation Before VS After Filtering")
plt.xlabel("Lag (Samples)")
plt.ylabel("Correlation")
plt.legend()
plt.show()

'''
Why Cross-Correlation Works with Noisy Signals?
Cross-correlation is a mathematical tool used to measure the 
similarity between two signals as a function of the time-lag
applied to one of them. When dealing with noisy Signal A and a shifted noisy Signal B,
cross-correlation can still accurately estimate the sample lag for the following reasons:

a. Signal Characteristics Stand Out

The original sinusoidal signal dominates the structure of both Signal A and Signal B. Noise is
generally random and does not have a consistent pattern. As a result, the periodic components
of the original signal strongly influence the cross-correlation calculation,
allowing it to estimate the correct lag.

b. Cross-Correlation Amplifies Consistent Patterns

Noise introduces random variations, but cross-correlation focuses on consistent patterns
shared between the two signals. The original sinusoidal signal, which is common to both 
Signal A and B (apart from the lag), aligns during cross-correlation, allowing an accurate lag calculation.


c. Noise Averages Out

When summing over all sample points during cross-correlation, the noise (which is random) 
tends to cancel out, while the structured signal (sinusoidal wave) accumulates. This effect 
makes cross-correlation robust to moderate noise levels.


d. Filtering Is Not Mandatory

Filtering the noise isn’t mandatory because the cross-correlation method 
is naturally resistant to random noise up to a certain extent. However, excessive
noise or noise with frequencies close to the original signal’s frequency can degrade accuracy.

'''