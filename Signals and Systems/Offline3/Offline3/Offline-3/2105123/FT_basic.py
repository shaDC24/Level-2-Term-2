import numpy as np
import matplotlib.pyplot as plt
    
        

different_Frequency_range=[]
different_Frequency_range.append(np.linspace(-1,1,1000))
different_Frequency_range.append(np.linspace(-2,2,1000))
different_Frequency_range.append(np.linspace(-5,5,1000))

# Define the interval and function and generate appropriate x values and y values
x_values = np.linspace(-10,10,1000)

parabolic=np.where((x_values>=-2)&(x_values<=2),x_values**2,0)
triangular=np.where((x_values >= -2) & (x_values <= 0), (x_values + 2) / 2,
                    np.where((x_values > 0) & (x_values <= 2), (x_values - 2) / (-2), 0))
sawtooth=np.where((np.abs(x_values)<=2),(x_values+2)/2,0)
rectangular=np.where((x_values>=-2)&(x_values<=2) ,1 ,0)

functions=[parabolic,triangular,sawtooth,rectangular]
funclabel=["y = x^2","triangular","sawtooth","rectangular"]

for i,func in enumerate(functions):
    
    y_values =func
    label=funclabel[i]
    # Plot the original function
    plt.figure(figsize=(12, 4))
    plt.plot(x_values, y_values, label=f"Original {label}")
    plt.title(f"Original Function ({label})")
    plt.xlabel("x")
    plt.ylabel("y")
    plt.legend()
    plt.show()

    for diff_freq in different_Frequency_range:
        # Define the sampled times and frequencies
        sampled_times = x_values
        frequencies =diff_freq
        # Fourier Transform 
        def fourier_transform(signal, frequencies, sampled_times):
            num_freqs = len(frequencies)
            ft_result_real = np.zeros(num_freqs)
            ft_result_imag = np.zeros(num_freqs)
            dt = sampled_times[1] - sampled_times[0]
            # Store the fourier transform results for each frequency. Handle the real and imaginary parts separately
            # use trapezoidal integration to calculate the real and imaginary parts of the FT
            for frqnc,frequency in enumerate(frequencies):
                ft_result_real[frqnc]=np.trapz(signal*np.cos(2*np.pi*frequency*sampled_times),sampled_times)
                ft_result_imag[frqnc]=np.trapz(-signal*np.sin(2*np.pi*frequency*sampled_times),sampled_times)

            return ft_result_real, ft_result_imag

        # Apply FT to the sampled data
        ft_data = fourier_transform(y_values, frequencies, sampled_times)
        #  plot the FT data
        plt.figure(figsize=(12, 6))
        plt.plot(frequencies, np.sqrt(ft_data[0]**2 + ft_data[1]**2))
        plt.title(f"Frequency Spectrum of {label}")
        plt.xlabel("Frequency (Hz)")
        plt.ylabel("Magnitude")
        plt.show()


    for frequencies in different_Frequency_range:
        # Inverse Fourier Transform 
        def inverse_fourier_transform(ft_signal, frequencies, sampled_times):
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

        # Reconstruct the signal from the FT data
        ft_data = fourier_transform(y_values, frequencies, sampled_times)
        reconstructed_y_values = inverse_fourier_transform(ft_data, frequencies, sampled_times)
        # Plot the original and reconstructed functions for comparison
        plt.figure(figsize=(12, 4))
        plt.plot(x_values, y_values, label=f"Original {label}", color="blue")
        plt.plot(sampled_times, reconstructed_y_values, label=f"Reconstructed {label}", color="red", linestyle="--")
        plt.title(f"Original vs Reconstructed Function ({label})")
        plt.xlabel("x")
        plt.ylabel("y")
        plt.legend()
        plt.show()
