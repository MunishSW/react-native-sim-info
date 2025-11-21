package com.siminfo

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import android.telephony.TelephonyManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.siminfo.NativeSimInfoSpec

class SimInfoModule(reactContext: ReactApplicationContext) :
  NativeSimInfoSpec(reactContext) {

  companion object { const val NAME = "SimInfoModule" }

  override fun getName() = NAME

  override fun addListener(eventName: String) {
    // Required for NativeEventEmitter compliance
  }

  override fun removeListeners(count: Double) {
    // Required for NativeEventEmitter compliance
  }

  override fun getSimSlotInfo(promise: Promise) {
    try {
      if (!hasPhoneStatePermission()) {
        promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required")
        return
      }

      val subscriptionManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
      if (subscriptionManager == null) {
        promise.reject("SERVICE_UNAVAILABLE", "SubscriptionManager is not available")
        return
      }

      val simSlots = Arguments.createArray()
      
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
        val activeSubscriptions = if (ActivityCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.READ_PHONE_STATE
          ) == PackageManager.PERMISSION_GRANTED
        ) {
          subscriptionManager.activeSubscriptionInfoList ?: emptyList()
        } else {
          promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission not granted")
          return
        }

        activeSubscriptions.forEach { subInfo ->
          val simInfo = createSimInfoMap(subInfo)
          simSlots.pushMap(simInfo)
        }

        promise.resolve(simSlots)
      } else {
        promise.reject("API_LEVEL_TOO_LOW", "API level 22 or higher is required")
      }
    } catch (e: SecurityException) {
      promise.reject("SECURITY_EXCEPTION", "Security exception: ${e.message}")
    } catch (e: Exception) {
      promise.reject("ERROR", "Error getting SIM info: ${e.message}")
    }
  }

  override fun hasMultipleSims(promise: Promise) {
    try {
      if (!hasPhoneStatePermission()) {
        promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required")
        return
      }

      val subscriptionManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
      if (subscriptionManager == null) {
        promise.resolve(false)
        return
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
        val activeSubscriptions = if (ActivityCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.READ_PHONE_STATE
          ) == PackageManager.PERMISSION_GRANTED
        ) {
          subscriptionManager.activeSubscriptionInfoList ?: emptyList()
        } else {
          promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission not granted")
          return
        }

        promise.resolve(activeSubscriptions.size > 1)
      } else {
        promise.resolve(false)
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Error checking multiple SIMs: ${e.message}")
    }
  }

  override fun getActiveSimCount(promise: Promise) {
    try {
      if (!hasPhoneStatePermission()) {
        promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required")
        return
      }

      val subscriptionManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
      if (subscriptionManager == null) {
        promise.resolve(0.0)
        return
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
        val activeSubscriptions = if (ActivityCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.READ_PHONE_STATE
          ) == PackageManager.PERMISSION_GRANTED
        ) {
          subscriptionManager.activeSubscriptionInfoList ?: emptyList()
        } else {
          promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission not granted")
          return
        }

        promise.resolve(activeSubscriptions.size.toDouble())
      } else {
        promise.resolve(0.0)
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Error getting active SIM count: ${e.message}")
    }
  }

  private fun createSimInfoMap(subInfo: SubscriptionInfo): WritableMap {
    val simInfo = Arguments.createMap()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
      simInfo.putInt("slotIndex", subInfo.simSlotIndex)
      simInfo.putString("displayName", subInfo.displayName?.toString() ?: "")
      simInfo.putString("carrierName", subInfo.carrierName?.toString() ?: "")
      simInfo.putString("countryIso", subInfo.countryIso ?: "")
      simInfo.putInt("subscriptionId", subInfo.subscriptionId)
      
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        simInfo.putInt("carrierId", subInfo.carrierId)
        simInfo.putBoolean("isEmbedded", subInfo.isEmbedded)
      } else {
        simInfo.putInt("carrierId", -1)
        simInfo.putBoolean("isEmbedded", false)
      }

      // Phone number (may be null or empty - try multiple methods)
      var phoneNumber: String? = null
      
      // Method 1: Try from SubscriptionInfo
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        if (ActivityCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.READ_PHONE_NUMBERS
          ) == PackageManager.PERMISSION_GRANTED
        ) {
          phoneNumber = subInfo.number
        }
      } else {
        if (hasPhoneStatePermission()) {
          phoneNumber = subInfo.number
        }
      }
      
      // Method 2: Try from TelephonyManager if still null
      if (phoneNumber.isNullOrEmpty() && hasPhoneStatePermission()) {
        try {
          val telephonyManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager
          if (telephonyManager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            phoneNumber = telephonyManager.createForSubscriptionId(subInfo.subscriptionId).line1Number
          } else if (telephonyManager != null) {
            phoneNumber = telephonyManager.line1Number
          }
        } catch (e: Exception) {
          // Ignore and continue
        }
      }
      
      if (phoneNumber != null && phoneNumber.isNotEmpty() && phoneNumber != "Unknown" && phoneNumber != "") {
        simInfo.putString("phoneNumber", phoneNumber)
      } else {
        simInfo.putNull("phoneNumber")
      }

      // ICC ID
      if (ActivityCompat.checkSelfPermission(
          reactApplicationContext,
          Manifest.permission.READ_PHONE_STATE
        ) == PackageManager.PERMISSION_GRANTED
      ) {
        val iccId = subInfo.iccId
        if (iccId != null && iccId.isNotEmpty()) {
          simInfo.putString("iccId", iccId)
        } else {
          simInfo.putNull("iccId")
        }
      } else {
        simInfo.putNull("iccId")
      }

      // MCC and MNC
      val mccString = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        subInfo.mccString
      } else {
        subInfo.mcc.toString()
      }
      
      val mncString = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        subInfo.mncString
      } else {
        subInfo.mnc.toString()
      }

      if (mccString != null && mccString != "0") {
        simInfo.putString("mcc", mccString)
      } else {
        simInfo.putNull("mcc")
      }

      if (mncString != null && mncString != "0") {
        simInfo.putString("mnc", mncString)
      } else {
        simInfo.putNull("mnc")
      }

      // Check if subscription is active
      simInfo.putBoolean("isActive", true) // If in active list, it's active
    }

    return simInfo
  }

  private fun hasPhoneStatePermission(): Boolean {
    return ActivityCompat.checkSelfPermission(
      reactApplicationContext,
      Manifest.permission.READ_PHONE_STATE
    ) == PackageManager.PERMISSION_GRANTED
  }
}
