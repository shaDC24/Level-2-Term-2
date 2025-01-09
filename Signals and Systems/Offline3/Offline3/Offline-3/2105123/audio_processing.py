import numpy as np
import scipy.io.wavfile as wavfile
import matplotlib.pyplot as plt

# Step 1: Load the audio file
sample_rate, data = wavfile.read('buzzjc.wav')
data = data / np.max(np.abs(data))  # Normalize to -1 to 1

# If stereo, convert to mono by averaging channels
if len(data.shape) > 1:
    data = data.mean(axis=1)

# Step 1.1: Plot the original audio signal in the time domain
plt.figure(figsize=(12, 4))
time = np.linspace(0, len(data) / sample_rate, num=len(data))
plt.plot(time, data)
plt.title("Original Audio Signal (Time Domain)")
plt.xlabel("Time (s)")  
plt.ylabel("Amplitude")
plt.show()

# Set parameters for interval sampling and FT
interval_step = 1  # Adjust for sampling every 'interval_step' data points  
data_sampled = data[::interval_step]
max_time = len(data_sampled) / (sample_rate / interval_step)
sampled_times = np.linspace(0, max_time, num=len(data_sampled))


max_freq = sample_rate / (2 * interval_step)
num_freqs = len(data_sampled)
frequencies = np.linspace(0, max_freq, num=num_freqs)

# Step 2: Apply Fourier Transform using trapezoidal integration
def fourier_transform(signal, frequencies, sampled_times):
    # use your code here from the first task
            num_freqs = len(frequencies)
            ft_result_real = np.zeros(num_freqs)
            ft_result_imag = np.zeros(num_freqs)
            # Store the fourier transform results for each frequency. Handle the real and imaginary parts separately
            # use trapezoidal integration to calculate the real and imaginary parts of the FT
            for frqnc,frequency in enumerate(frequencies):
                ft_result_real[frqnc]=np.trapz(signal*np.cos(2*np.pi*frequency*sampled_times),sampled_times)
                ft_result_imag[frqnc]=np.trapz(-signal*np.sin(2*np.pi*frequency*sampled_times),sampled_times)
            return ft_result_real, ft_result_imag
    

# Apply FT with trapezoidal integration
ft_data = fourier_transform(data_sampled, frequencies, sampled_times)

# Step 2.1: Visualize the frequency spectrum
plt.figure(figsize=(12, 6))
plt.plot(frequencies, np.sqrt(ft_data[0]**2 + ft_data[1]**2))
plt.title("Frequency Spectrum of the Audio Signal (Custom FT with Trapezoidal Integration)")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.show()

# Step 3: Filter out unwanted noise frequencies
filtered_ft_data= np.zeros((2, num_freqs))
filtered_ft_data[0] = ft_data[0].copy()
filtered_ft_data[1] = ft_data[1].copy()

# Try to filter out the frequencies for which you get the best result.
# Experiment with different ideas like make the values for low frequencies zero, or make high frequencies zero, or make a range of frequencies zero. 
noise_indices = (frequencies>=0) & (frequencies<=1000)
filtered_ft_data[0][noise_indices]=0
filtered_ft_data[1][noise_indices]=0
# Step 3.1: Visualize the filtered frequency spectrum
plt.figure(figsize=(12, 6))
plt.plot(frequencies, np.sqrt(filtered_ft_data[0]**2 + filtered_ft_data[1]**2))
plt.title("Filtered Frequency Spectrum (Unwanted Frequencies Removed)")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.show()
# Step 4: Apply Inverse Fourier Transform using trapezoidal integration
def inverse_fourier_transform(ft_signal, frequencies, sampled_times):
    # use your code here from the first task
            n = len(sampled_times)
            reconstructed_signal = np.zeros(n)
            df = frequencies[1] - frequencies[0]
            # Reconstruct the signal by summing over all frequencies for each time in sampled_times.
            # use trapezoidal integration to calculate the real part
            for i,time in enumerate(sampled_times):
                realPart=ft_signal[0]*np.cos(2*np.pi*time*frequencies)-ft_signal[1]*np.sin(2*np.pi*time*frequencies)
                imagPart=ft_signal[0]*np.cos(2*np.pi*time*frequencies)+ft_signal[1]*np.sin(2*np.pi*time*frequencies)
                reconstructed_signal[i]=np.trapz(realPart,frequencies)
            # You have to return only the real part of the reconstructed signal
            return reconstructed_signal

# Step 4.1: Reconstruct the signal using IFT
filtered_data = inverse_fourier_transform(filtered_ft_data, frequencies, sampled_times)

# Step 4.2: Plot the reconstructed audio signal
plt.figure(figsize=(12, 4))
plt.plot(sampled_times, filtered_data)
plt.title("Reconstructed (Denoised) Audio Signal (Time Domain)")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.show()

# Step 5: Normalize and save the denoised audio
filtered_data = np.int16(filtered_data / np.max(np.abs(filtered_data)) * 32767)  # Convert to int16 format for WAV
wavfile.write('denoised_audio.wav', sample_rate, filtered_data)

print("Denoised audio saved as 'denoised_audio.wav'")


